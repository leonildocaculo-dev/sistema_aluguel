# Fase 1: Instalação de dependências
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Fase 2: Construção da aplicação (Build)
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Desativar telemetria do Next.js para poupar memória e tempo
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Fase 3: Produção (Runner) - Imagem ultra leve apenas com o que importa
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar ficheiros essenciais do builder
COPY --from=builder /app/public ./public
# Criar diretório para cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# O Next.js copia automaticamente as dependências estritas para o "standalone"
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# Isto é essencial para o Railway conseguir conectar-se ao servidor
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
