FROM node:20-alpine

WORKDIR /app

# Ajustar permissões e instalar ferramentas necessárias
RUN apk add --no-cache libc6-compat

# Copiar package.json (será preenchido pelo volume no dev, mas deixamos aqui como base)
COPY package.json package-lock.json* ./

# Evitar instalar no Dockerfile se estivermos a usar volumes para node_modules em dev,
# mas para ter um fallback:
RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
