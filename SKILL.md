---
name: angolastay-project-conventions
description: Convenções, regras de negócio e limites de âmbito do projecto AngolaStay (plataforma angolana de reservas de alojamento). Consulta este skill SEMPRE que trabalhares em qualquer ficheiro deste repositório — backend Laravel, frontend React, migrations, endpoints de pagamento, autenticação, ou estrutura de pastas. É obrigatório consultar antes de: criar ou alterar migrations, implementar qualquer lógica de reservas ou disponibilidade, implementar ou alterar qualquer fluxo de pagamento, criar endpoints novos, ou decidir se uma funcionalidade pertence ao MVP ou ao backlog. Usa também quando o pedido mencionar "AngolaStay", "reserva", "propriedade", "acomodação", "comissão", "Multicaixa", "referência", ou "comprovativo".
---

# AngolaStay — Convenções do Projecto

Plataforma de intermediação de reservas de alojamento em Angola. Este documento é a fonte de verdade para decisões de arquitectura, âmbito e regras de negócio. Se código gerado contradizer este ficheiro, o ficheiro tem prioridade — pára e sinaliza o conflito em vez de decidir sozinho.

## 0. Antes de qualquer tarefa

1. Confirma se a tarefa pertence ao **MVP (secção 3)** ou ao **backlog (secção 4)**. Não construas backlog antes do MVP estar completo e testado.
2. Para tarefas que tocam em **pagamentos, migrations, ou autorização** → usa **Plan Mode**, gera o plano e espera revisão antes de executar.
3. Para ajustes triviais de UI/copy → **Fast Mode** é aceitável.
4. Faz **commit incremental** no final de cada tarefa concluída e verificada. Nunca acumules várias funcionalidades num único commit.

## 1. Stack (não alterar sem justificação explícita)

**Frontend:** React + TypeScript + Vite + Tailwind + shadcn/ui + React Router + TanStack Query + Axios + Zustand (estado global) + React Hook Form + Zod (validação) + vite-plugin-pwa.

**Backend:** Laravel 12 + PHP 8.3+ + Sanctum + Form Requests + API Resources + Laravel Horizon (filas). Octane só depois do MVP validado, nunca antes.

**Base de dados:** PostgreSQL com PostGIS (pesquisa geoespacial), `pg_trgm` (pesquisa por texto), constraint `EXCLUDE USING gist` na tabela `availability` para impedir duplo booking ao nível da BD — **não confiar apenas em validação da aplicação para isto**.

**Infra:** Docker + Docker Compose + Nginx + Redis (cache + sessões + filas + rate limiting, databases lógicas separadas) + Supervisor + Cloudflare R2 + CDN + Sentry + GitHub Actions (testes obrigatórios antes de merge).

## 2. Regras de negócio não negociáveis

Estas regras vêm de decisões de produto explícitas. Nunca implementar código que as viole, mesmo que pareça mais simples:

- **Uma reserva nunca é confirmada sem pagamento validado.** Nem por transferência manual (requer aprovação de admin), nem por referência/iframe (requer webhook verificado).
- **A comissão da plataforma é calculada no momento da confirmação do pagamento, nunca na criação da reserva.** Reservas nunca pagas não geram comissão.
- **Reservas em estado `pendente_pagamento` ou `aguarda_validação` expiram automaticamente** (2h para pagamento automático, 24h para transferência manual) e libertam a disponibilidade.
- **Só existem 3 métodos de pagamento válidos**: `referencia`, `multicaixa_iframe`, `transferencia`. Não adicionar PayPay nem Multicaixa Express via API/SDK direct — foram excluídos deliberadamente (ver prompt v2, secção 6).
- **Webhooks de pagamento exigem verificação de assinatura + idempotência.** Nunca processar um evento de pagamento sem confirmar que não foi processado antes (usar `idempotency_key` único).
- **Avaliações só podem ser criadas após reserva com estado `finalizada`.**
- **Um proprietário nunca acede a dados de outro proprietário**, mesmo manipulando IDs no pedido — cobrir isto com Policy do Laravel + teste automatizado.
- **Admin exige 2FA** para qualquer conta com acesso a validação de pagamentos.

## 3. Âmbito do MVP — construir apenas isto primeiro

1. Autenticação (Cliente, Proprietário, Admin) via Sanctum
2. Cadastro + aprovação administrativa de propriedade e acomodação (fotos via R2)
3. Pesquisa por localização, preço, capacidade (usar os índices definidos na secção 5)
4. Reserva com bloqueio de concorrência via constraint na BD
5. Pagamento por **transferência manual apenas** (único método sem dependência de terceiros para lançar)
6. Dashboard básico: proprietário vê reservas; admin aprova propriedades e valida pagamentos

**Não construir no MVP:** referência Multicaixa, iframe GPO, avaliações, mapa/PostGIS em produção, notificações WhatsApp, Octane. Estes ficam no backlog (secção 4) e só arrancam depois do MVP estar em produção.

## 4. Backlog (ordem de prioridade)

1. Pagamento por Referência Multicaixa (integração técnica corre em paralelo ao MVP; o processo contratual com o agregador é externo e não bloqueia o desenvolvimento)
2. Multicaixa via iframe/widget GPO
3. Avaliações
4. Mapa e pesquisa geoespacial (PostGIS)
5. Notificações — priorizar WhatsApp Business API sobre push/Firebase
6. Laravel Octane, se métricas de performance justificarem

## 5. Base de dados — convenções

- Toda a tabela de listagem tem paginação obrigatória na API — nunca devolver todos os registos
- Eager loading obrigatório em queries de listagem — bloquear qualquer PR com N+1 detectado
- Índices compostos obrigatórios: `properties(province, municipality, price_per_night)`
- Tabela `payments` segue este esquema (não desviar sem actualizar este ficheiro):
  ```
  id, reservation_id, método (enum: referencia|multicaixa_iframe|transferencia),
  valor, referência_gerada (nullable), webhook_payload (jsonb, nullable),
  comprovativo_path (nullable), estado (enum: pendente|aguarda_validação|confirmado|rejeitado|expirado),
  idempotency_key (unique), validado_por (nullable), data_pagamento, timestamps
  ```
- Tabelas adicionais: `payment_webhooks_log`, `idempotency_keys`, `audit_logs` (imutável — nunca fazer UPDATE/DELETE, só INSERT)

## 6. Segurança — checklist a aplicar em cada PR relevante

- [ ] Rota nova tem Policy de autorização explícita (não apenas `auth:sanctum`)
- [ ] Upload de ficheiro valida tipo MIME real (não extensão) + tamanho máximo
- [ ] Nenhum segredo em código ou em `.env` commitado
- [ ] Webhook novo verifica assinatura + idempotência antes de processar
- [ ] Rota financeira/sensível tem rate limiting
- [ ] CORS restrito ao domínio da aplicação (nunca `*` em produção)
- [ ] Acção administrativa sensível gera entrada em `audit_logs`

## 7. Estrutura de pastas

**Backend (Laravel):**
```
app/
  Http/Controllers/Api/{Auth,Properties,Accommodations,Reservations,Payments,Admin}/
  Http/Requests/{...}
  Http/Resources/{...}
  Models/
  Policies/
  Services/           ← lógica de negócio complexa (ex: PaymentService, AvailabilityService)
  Jobs/                ← filas (processamento de imagem, notificações, expiração de reservas)
database/migrations/
database/factories/
tests/Feature/ ,tests/Unit/
```

**Frontend (React):**
```
src/
  pages/
  components/ui/       ← shadcn
  components/{domain}/ ← componentes específicos de propriedade/reserva/checkout
  hooks/
  services/            ← chamadas Axios/TanStack Query
  stores/               ← Zustand
  schemas/              ← Zod, partilhados entre formulário e validação de API
```

## 8. Testes

- Toda a Service de negócio crítico (pagamentos, disponibilidade, comissão) tem teste de unidade cobrindo o caso feliz + pelo menos 2 casos de erro
- Todo o endpoint novo tem teste Feature cobrindo autorização (utilizador sem permissão recebe 403)
- Concorrência de reserva (duplo booking) tem teste dedicado que simula pedidos simultâneos

## 9. Quando parar e perguntar ao humano

- Antes de activar em produção qualquer integração de pagamento — confirmar requisitos actuais junto do banco/agregador, não assumir que a documentação está actualizada
- Antes de adicionar qualquer dependência nova não listada na secção 1
- Antes de alterar o esquema da tabela `payments` ou `availability`
- Se uma tarefa pedida pertencer claramente ao backlog (secção 4) mas o MVP ainda não estiver completo
