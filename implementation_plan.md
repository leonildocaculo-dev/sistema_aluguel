# Plano de Migração: AngolaStay (React SPA -> Next.js 15)

O objetivo é realizar uma migração controlada do frontend atual em React (SPA/Vite) para uma stack moderna com Next.js 15 (App Router), mantendo o backend Laravel 12 intacto. 

---

## FASE 1: Análise Completa

### 1. Arquitetura Atual
- **Frontend**: Aplicação Single Page (SPA) renderizada do lado do cliente (CSR) com React 19, empacotada via Vite. O roteamento é gerido pelo `react-router-dom`. O estado global usa Zustand e chamadas assíncronas são geridas pelo React Query.
- **Backend**: API REST baseada em Laravel 12 com autenticação Sanctum. 
- **Infraestrutura**: Contentores Docker (Frontend Vite no porto 5173, Backend/Nginx no porto 8000, PostgreSQL, Redis).

### 2. Fluxo Completo da Aplicação
1. O utilizador acede à SPA e o ficheiro estático HTML é carregado.
2. O React Router encarrega-se da navegação no cliente.
3. Para autenticação, é feito um pedido `GET /sanctum/csrf-cookie` seguido de um `POST /login` ou `/register`.
4. O backend retorna um `access_token` que é armazenado de forma insegura no `localStorage` e guardado no estado global (`useAuthStore`).
5. Nas requisições seguintes, o Axios injeta o `Authorization: Bearer <token>`.

### 3. Dependências do Frontend Atual
- React 19.2, Vite 8.1
- Tailwind CSS 4, Radix UI Primitives, Lucide React
- React Router DOM 7
- Zustand 5
- TanStack React Query 5
- React Hook Form, Zod
- Axios
- Framer Motion, Mapbox GL
- React Helmet Async (para SEO dinâmico)

### 4. Dependências do Backend
- Laravel 12, PHP 8.2/8.3+
- Sanctum (API Token Authentication)
- PostgreSQL (imagem com PostGIS para geospatiais)
- Redis (Caches/Queues)
- Docker & Nginx

### 5. Como Frontend e Backend Comunicam
- Comunicação puramente por API REST (JSON).
- Axios configurado com `withCredentials: true` e `baseURL` apontando para a API do Laravel.
- Utilização de intercetores no Axios para injetar o token JWT/Sanctum a partir do `localStorage`.

### 6. Pontos Críticos
- **Autenticação no SSR**: O `localStorage` não está disponível no servidor (Server Components). Para que o Next.js proteja as rotas no servidor ou faça fetch com auth, o token terá de ser gerido via **Cookies** HTTP-Only (ou utilizando Route Handlers do Next.js como middleware para armazenar os cookies).
- **React Query e SSR**: O fetch de dados iniciais precisa de ser adaptado (Hydration Boundary ou fetch direto nos Server Components e passagem via props).
- **Hydration Mismatches**: A leitura do Zustand (`localStorage.getItem`) logo na inicialização vai causar erros de hidratação no Next.js.

### 7. Possíveis Problemas
- Perda de estado de sessão ao transitar entre rotas devido a implementação errada de cookies.
- Rotas com Mapbox podem falhar caso sejam carregadas no lado do servidor (precisam de `"use client"` e Dynamic Import).
- Quebras no layout por importações diretas de ficheiros CSS não globais.

### 8. Componentes Reutilizáveis
- Praticamente toda a pasta `components/` (especialmente Radix UI, botões, cards, inputs). Estes componentes visuais são puramente React.

### 9. Código Que Pode Ser Mantido
- Definições de Tipos (`types/`)
- Schemas do Zod (`schemas/`)
- Serviços API (`services/`) - *com pequenas adaptações para ler cookies em vez de localStorage no contexto do servidor*.
- Estrutura base de estilização do Tailwind.

### 10. Código Que Deve Ser Removido
- `main.tsx` e `App.tsx` (substituídos pela estrutura `app/` do Next.js).
- Dependência `react-router-dom` e `react-helmet-async` (Next.js usa App Router e Metadata API).
- Ficheiros de configuração do Vite (`vite.config.ts`).

### 11. Código Que Precisa Apenas Ser Adaptado
- **Store de Autenticação (`authStore.ts`)**: Mover a leitura de `localStorage` para um mecanismo *client-only* seguro com persistência, ou gerir o estado de login através do Cookie em layout.
- **Axios Interceptors (`api.ts`)**: Adaptar para procurar o token no SSR (via `cookies()` no Next.js) e no CSR.

### 12. Bibliotecas Incompatíveis com Next.js
- `react-router-dom` e `react-helmet-async` são redundantes/incompatíveis com a arquitetura nativa.
- Mapbox GL / Leaflet precisam de cuidados redobrados (imports dinâmicos com `ssr: false`).

### 13. Dependências Desnecessárias
- Apenas as associadas ao build com Vite e Roteamento Client-side listadas acima.

### 14. Melhor Estratégia de Migração
A **Abordagem Estranguladora Controlada (In-Place Migration)**:
1. Instalar pacotes base do Next.js dentro de uma nova pasta (ou reestruturar `frontend` apagando ficheiros Vite e instalando pacotes Next). Para evitar quebrar o atual, iremos inicializar o Next.js dentro do `frontend`, substituir os ficheiros de build e renomear `src/pages` para a estrutura `app/` gradualmente.
2. Manter grande parte das páginas como Client Components (`"use client"`) numa fase inicial para mitigar o choque arquitetural e garantir funcionalidade rápida.
3. Posteriormente, migrar as chamadas de API puramente de leitura para **React Server Components** visando performance.

### 15. Estimativa de Esforço
- **Setup e Configuração**: 1 dia
- **Migração de Layouts, Auth e Stores**: 1-2 dias
- **Migração de Rotas (Pages -> App Router)**: 2-3 dias
- **Testes e Limpeza**: 1 dia
- **Total estimado**: ~5 a 7 dias de foco intenso.

---

## FASE 2: Plano de Migração (Etapas)

Cada fase deverá ser iniciada e validada de forma independente.

### [ ] Fase 1: Setup da Infraestrutura Next.js 15
- **Objetivo**: Inicializar Next.js 15, reescrever ficheiros de build (Remover Vite, adicionar `next.config.ts`), ajustar Dockerfile e manter o container funcional.
- **Checklist**:
  - [ ] Substituir dependências no `package.json`.
  - [ ] Apagar Vite, adicionar configs Next.
  - [ ] Criar estrutura base `app/layout.tsx` e `app/page.tsx`.
  - [ ] Adaptar `Dockerfile` do frontend (usar npm run dev com Next).
  - [ ] Verificar container Docker a correr na porta 5173 ou ajuste no Nginx/Compose.

### [ ] Fase 2: Configuração de Utilitários Core e Providers
- **Objetivo**: Configurar Zustand (hydration-safe), TailwindCSS (configurações do Next), TanStack Query e Axios.
- **Checklist**:
  - [ ] Configurar React Query Provider num Client Component wrapper.
  - [ ] Adaptar `api.ts` para ler Token tanto de cookies como client-side.
  - [ ] Refatorar `authStore.ts` para usar cookies / Zustand persist com SSR hydration segura.
  - [ ] Migrar ficheiro global de estilos `index.css`.

### [ ] Fase 3: Migração do Sistema de Autenticação
- **Objetivo**: Garantir que Login, Registo e Recuperação de Password funcionam.
- **Checklist**:
  - [ ] Criar pastas em `app/(auth)/login`, `app/(auth)/registo`.
  - [ ] Migrar componentes (usando `"use client"`).
  - [ ] Implementar gestão segura de tokens JWT (armazenamento em Cookies preferencialmente, para suportar sessões no Server).
  - [ ] Validar Fluxo Login -> Receber Token -> Guardar Cookie -> Atualizar Zustand.

### [ ] Fase 4: Migração de Layouts Principais e Página Home
- **Objetivo**: Migrar o Main Layout e a Landing Page (Home), transformando SEO (Helmet) na Metadata API.
- **Checklist**:
  - [ ] Migrar `<MainLayout>` (NavBar, Footer).
  - [ ] Migrar `Home.tsx` para `app/(public)/page.tsx`.
  - [ ] Utilizar Metadata Export para SEO estático.
  - [ ] Validar React Query na listagem de imóveis em destaque.

### [ ] Fase 5: Módulo de Busca e Propriedades
- **Objetivo**: Migrar a Listagem e as Páginas de Detalhe.
- **Checklist**:
  - [ ] Criar `app/(public)/pesquisa/page.tsx`.
  - [ ] Criar `app/(public)/propriedade/[id]/page.tsx`.
  - [ ] Migrar mapas (Dynamic Imports com `ssr: false`).
  - [ ] Validar navegação e rotas dinâmicas.

### [ ] Fase 6: Checkout e Reservas
- **Objetivo**: Migrar processo de Checkout.
- **Checklist**:
  - [ ] Criar `app/(protected)/checkout/[id]/page.tsx`.
  - [ ] Proteger rota (Middleware do Next.js).
  - [ ] Validar envio de formulários e integração com pagamentos.

### [ ] Fase 7: Dashboards (Client, Owner, Admin)
- **Objetivo**: Migrar painéis internos usando Route Groups e Layouts Aninhados.
- **Checklist**:
  - [ ] Criar Route Groups: `app/(dashboard)/cliente`, `app/(dashboard)/owner`, `app/(dashboard)/admin`.
  - [ ] Migrar componentes de Dashboard e `DashboardLayout`.
  - [ ] Proteger rotas (verificando role no middleware).

### [ ] Fase 8: Optimização e Limpeza
- **Objetivo**: Substituir recursos pesados e remover lixo.
- **Checklist**:
  - [ ] Usar `<Image>` do `next/image` nos cards.
  - [ ] Apagar pasta `src/pages` legada e dependências não utilizadas (`react-router-dom`).
  - [ ] Passar ESLint e TypeScript check na build de produção.
  - [ ] Teste end-to-end de toda a navegação e actions.

---

> [!IMPORTANT]
> **Decisão Arquitetural Pendente para Início da Execução**: 
> Uma vez que o backend passa tokens Sanctum via payload e atualmente eles são salvos no `localStorage`, ao migrar para Next.js teremos problemas em Server Components se precisarmos que o servidor saiba da sessão. 
> A minha recomendação, sem tocar no backend, é: **Quando o utilizador faz login e recebe o token, o cliente Next.js salvará esse token num Cookie HTTP (usando a lib `js-cookie` ou Route Handlers) em vez de `localStorage`**. Dessa forma, o `middleware.ts` do Next.js e os Server Components poderão ler o cookie `auth_token` e proteger as rotas diretamente do lado do servidor.
> O que acha desta abordagem?

Por favor, analise as Fases acima. Assim que as aprovar (ou sugerir ajustes), darei início à execução estrita da **Fase 1** sem avançar para outras.
