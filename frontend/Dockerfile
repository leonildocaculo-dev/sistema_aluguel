FROM node:20-alpine

WORKDIR /app

# Instalar dependências
COPY package.json package-lock.json* ./
RUN npm ci

# Copiar projeto
COPY . .

EXPOSE 5173

# Correr em modo desenvolvimento
CMD ["npm", "run", "dev"]
