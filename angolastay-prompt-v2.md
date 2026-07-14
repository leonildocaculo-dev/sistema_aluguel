# PROMPT DE DESENVOLVIMENTO — AngolaStay (v2)
### Plataforma Angolana de Reservas de Alojamento e Serviços Turísticos
Optimizado para execução com **Google Antigravity** (agentes autónomos, modo Plan → Review → Execute)

---

## 0. Nota sobre esta revisão

Esta versão substitui a anterior em três pontos pedidos explicitamente:

1. **Excluído:** PayPay Angola e Multicaixa Express via integração directa/API certificada (processo de certificação pesado, auditoria de segurança à infraestrutura do comerciante, contrato dedicado).
2. **Incluído:** Pagamento por Referência Multicaixa (via agregador, ex. ProxyPay) e Multicaixa via **iframe/widget do GPO** (integração leve — o comerciante insere tags no frontend, sem necessitar de certificação API completa).
3. **Assunção que estou a fazer, sinaliza-me se estiver errada:** entendo "Multicaixa Express" excluído como a integração nativa app-to-app/API certificada, e "Multicaixa por iframe" incluído como o widget GPO (que pode, internamente, oferecer pagamento por telemóvel/QR, mas com certificação simplificada tipo Webframe). Se a tua intenção era excluir *qualquer* forma de Multicaixa Express, diz-me e eu ajusto o fluxo 6.2 abaixo.

---

## 1. Princípios não negociáveis

Todo o código gerado (por humano ou por agente) deve respeitar:

- **Segurança em primeiro lugar**: nenhum dado sensível em texto plano, nenhuma rota financeira sem autenticação + autorização explícita, nenhum segredo em repositório.
- **Escalabilidade horizontal desde o dia 1**: API stateless (sessão/cache em Redis, não em ficheiro/memória local), sem estado guardado no processo do servidor.
- **Performance mensurável**: toda a funcionalidade de listagem/pesquisa tem de ter um plano de índice de base de dados documentado antes de ser implementada.
- **MVP primeiro, backlog depois**: nenhuma tarefa do backlog (secção 9) é iniciada antes do MVP (secção 8) estar funcional e testado.

---

## 2. Stack tecnológica (com correcções)

### Frontend Web
| Original | Mantido/Alterado | Motivo |
|---|---|---|
| React + TypeScript + Vite | ✅ Mantido | Adequado |
| Tailwind + shadcn/ui | ✅ Mantido | Adequado |
| React Router | ✅ Mantido | — |
| TanStack Query + Axios | ✅ Mantido | — |
| Zustand | ✅ Mantido (evitar Context API para estado global de app — re-renders) | Context API só para theming/i18n |
| — | ➕ **React Hook Form + Zod** | Validação de formulários (reserva, cadastro de propriedade) partilhando schema com o backend via contrato de API |
| — | ➕ **vite-plugin-pwa** | Angola tem zonas de conectividade instável; cache de assets e modo offline-leve são requisito, não luxo |

### Backend API
| Original | Mantido/Alterado | Motivo |
|---|---|---|
| Laravel 12 + PHP 8.3+ | ✅ Mantido | — |
| Sanctum | ✅ Mantido | Adequado para SPA + mobile futuro |
| Form Requests, API Resources | ✅ Mantido | — |
| — | ➕ **Laravel Horizon** | Monitorização de filas (pagamentos, emails, processamento de imagens são todos assíncronos) |
| — | ➕ **Laravel Octane (opcional, avaliar em fase de hardening)** | Só activar depois do MVP validado — reduz latência mas exige atenção a memory leaks em estado partilhado |
| — | ➕ **PostgreSQL full-text search + `pg_trgm`**, ou Meilisearch se o volume crescer | Pesquisa "optimizada" exigida no prompt original não é alcançável com `LIKE '%...%'` a partir de algumas centenas de propriedades |

### Base de Dados
- PostgreSQL (mantido) com:
  - Índices compostos em `(province, municipality, price_per_night)` para filtros de pesquisa
  - Índice GiST/GIN para pesquisa geoespacial (`PostGIS` — **adicionar à stack**, necessário para "pesquisar por mapa" e cálculo de distância mencionados no módulo 9 original)
  - Constraint de exclusão (`EXCLUDE USING gist`) na tabela de disponibilidade para **impedir duplo booking ao nível da base de dados**, não só na aplicação

### Infraestrutura
| Original | Mantido/Alterado | Motivo |
|---|---|---|
| Docker + Docker Compose + Nginx | ✅ Mantido | — |
| Redis | ✅ Mantido, expandido | Cache + sessões + filas + rate limiting, tudo no mesmo Redis (separar databases lógicas) |
| Supervisor | ✅ Mantido | — |
| GitHub Actions | ✅ Mantido | ➕ adicionar stage de testes automáticos obrigatório antes de merge |
| — | ➕ **Cloudflare R2 + CDN na frente** | Já previsto no original para storage; falta explicitar CDN para servir imagens rápido fora de Luanda |
| — | ➕ **Sentry** (erros) | Sem isto, bugs em produção só se descobrem por reclamação de utilizador |

---

## 3. Segurança — checklist obrigatório

- Autenticação: Sanctum com expiração de token curta + refresh, 2FA obrigatório para contas de **Administrador** (acesso a validação de pagamentos)
- Autorização: Policies do Laravel para cada acção (um proprietário nunca acede a dados de outro proprietário via manipulação de ID — testar isto explicitamente)
- Rate limiting por IP e por utilizador em: login, criação de reserva, upload de comprovativo
- Validação estrita de uploads: tipo MIME real (não extensão), tamanho máximo, scan antivírus (ClamAV em container) antes de aceitar comprovativos de pagamento
- Webhooks de pagamento (ProxyPay/GPO): **verificação de assinatura obrigatória** + idempotência (mesmo evento de pagamento não pode ser processado duas vezes)
- Segredos: `.env` nunca commitado; em produção usar Docker secrets ou variável de ambiente injectada pelo CI/CD, nunca hardcoded
- Logs de auditoria imutáveis para: aprovação de pagamento, aprovação de propriedade, alteração de comissão, alteração de dados bancários de proprietário
- CORS restrito ao domínio da aplicação, nunca `*` em produção

---

## 4. Performance e escalabilidade

- API sem estado: nada de sessão em ficheiro local — tudo em Redis, para permitir múltiplas instâncias atrás do Nginx/load balancer
- Eager loading obrigatório em todas as queries de listagem (prevenir N+1) — revisão de código deve bloquear PRs com N+1 detectado
- Paginação obrigatória em qualquer endpoint que devolva listas (nunca devolver "todos os registos")
- Imagens: pipeline de compressão + geração de variantes responsivas (thumbnail, médio, full) no upload, servidas via CDN
- Cache de resultados de pesquisa frequentes em Redis com invalidação por evento (nova reserva, nova propriedade aprovada)
- Fila assíncrona para: envio de email, processamento de imagem, geração de notificação — nunca bloquear o pedido HTTP do utilizador à espera destas tarefas

---

## 5. Tipos de utilizador e permissões

*(mantido do prompt original — Cliente, Proprietário, Administrador — sem alterações estruturais)*

---

## 6. Sistema de Pagamentos (revisto)

### 6.1 Métodos suportados
1. **Pagamento por Referência Multicaixa** (via agregador tipo ProxyPay): gera referência numérica, cliente paga em ATM/homebanking, confirmação por webhook
2. **Multicaixa via iframe/widget GPO**: widget embutido no checkout, certificação leve (Webframe), sem necessidade de auditoria de infraestrutura própria
3. **Transferência bancária manual**: upload de comprovativo → fila de validação administrativa

### 6.2 Fluxo por método

**Referência / iframe (automatizados):**
```
Cliente inicia checkout
  ↓
Sistema gera referência ou carrega widget iframe
  ↓
Reserva fica em estado "pendente_pagamento" com expiração (ex: 2h)
  ↓
Webhook de confirmação chega (assinatura verificada + idempotência)
  ↓
Reserva confirmada automaticamente
  ↓
[Se expirar sem pagamento] → reserva cancelada automaticamente, disponibilidade libertada
```

**Transferência manual (fallback):**
```
Cliente paga → envia comprovativo (imagem/PDF, validado por tipo e tamanho)
  ↓
Reserva fica em estado "aguarda_validação" com expiração (ex: 24h)
  ↓
Administrador valida (aprovação exige justificação em caso de rejeição)
  ↓
Reserva confirmada ou rejeitada, cliente notificado
```

### 6.3 Tabela `payments` (ajustada)
```
id
reservation_id
método (enum: 'referencia', 'multicaixa_iframe', 'transferencia')
valor
referência_gerada (nullable — só para método referência)
webhook_payload (jsonb, nullable — auditoria do callback recebido)
comprovativo_path (nullable — só para transferência)
estado (enum: pendente, aguarda_validação, confirmado, rejeitado, expirado)
idempotency_key (unique — previne duplo processamento)
validado_por (nullable — admin_id, só para transferência)
data_pagamento
created_at / updated_at
```

### 6.4 Nota legal
Antes de activar qualquer método em produção: confirmar com o banco parceiro e/ou agregador os requisitos contratuais actuais (podem mudar). Não assumir que a documentação pública está actualizada — validar directamente com o fornecedor antes do lançamento.

---

## 7. Sistema de Comissão

*(mantido do prompt original)* — percentagem configurável dinamicamente, aplicada no momento da confirmação do pagamento (não na criação da reserva, para evitar comissão sobre reservas nunca pagas).

---

## 8. MVP — âmbito obrigatório da primeira entrega

Nada além disto é construído antes de o MVP estar em produção e testado com utilizadores reais:

1. Autenticação (Cliente, Proprietário, Admin) com Sanctum
2. Cadastro e aprovação administrativa de propriedade + acomodação (com fotos via R2)
3. Pesquisa por localização, preço, capacidade (com os índices da secção 2)
4. Reserva com bloqueio de concorrência (constraint de exclusão na BD)
5. Pagamento por **transferência manual** (o único que não depende de terceiros externos para lançar)
6. Dashboard básico de proprietário (ver reservas) e admin (aprovar propriedades, validar pagamentos)

---

## 9. Backlog pós-MVP (por prioridade)

1. Pagamento por Referência Multicaixa (depende de contrato com agregador — correr em paralelo ao desenvolvimento do MVP, não depois)
2. Multicaixa via iframe
3. Avaliações (só após reserva concluída)
4. Mapa e pesquisa geoespacial (PostGIS)
5. Notificações — **priorizar WhatsApp Business API sobre push/Firebase**, dado o padrão de comunicação do mercado angolano
6. Laravel Octane (só se métricas de performance justificarem)

---

## 10. Modelo de dados

*(migrations mantidas do prompt original: users, roles, permissions, properties, property_images, accommodations, availability, reservations, payments, transactions, reviews, notifications, settings, audit_logs)*
➕ adicionar: `payment_webhooks_log`, `idempotency_keys`

---

## 11. Como estruturar isto no Google Antigravity

Recomendações específicas para a forma de trabalho agente-first do Antigravity:

- **Cria um `SKILL.md` do projecto** com convenções de código, estrutura de pastas, e regras de negócio (ex: "nunca confirmar reserva sem pagamento validado"). Isto reduz alucinação do agente porque ele carrega o contexto certo só quando relevante.
- **Usa Plan Mode** para qualquer tarefa que toque em pagamentos, migrations, ou autorização — tarefas de alto risco merecem plano revisto antes de execução. **Usa Fast Mode** só para ajustes de UI e correcções triviais.
- **Divide o MVP (secção 8) em tarefas pequenas e verificáveis** (uma por módulo), não um único prompt gigante — o agente verifica melhor resultados pequenos e concretos.
- **Commits incrementais obrigatórios**: pede ao agente para commitar após cada tarefa concluída e verificada, para poderes reverter rapidamente se ele seguir um caminho arquitectural errado.
- **Revê sempre os Artifacts** (capturas de ecrã, walkthroughs, planos) antes de aprovar mudanças em fluxos de pagamento ou autenticação — não aproves às cegas.
- **Nunca deixes o agente gerir segredos ou correr migrations contra produção sem revisão manual explícita.**

---

## 12. Entregáveis esperados (mantidos, ajustados à ordem de fases)

1. Arquitectura completa (esta revisão)
2. `SKILL.md` do projecto para o Antigravity
3. Modelo ER da base de dados
4. Migrations Laravel (MVP primeiro)
5. Endpoints da API documentados (MVP primeiro)
6. Estrutura de pastas frontend React
7. Sistema de autenticação completo
8. Dockerização
9. CI/CD com testes obrigatórios
10. Guia de instalação e deploy
