# Etapa de build
FROM node:20-bullseye as builder

WORKDIR /app

# Copiar os arquivos do projeto
COPY package*.json ./
RUN npm install

# Copiar o código fonte
COPY . .

# Gerar o Prisma Client
RUN npx prisma generate

# Etapa de produção
FROM node:20-bullseye AS runner

WORKDIR /app

# Copiar dependências instaladas do build
COPY --from=builder /app /app

EXPOSE 3000

CMD ["node", "dist/server.js"]
