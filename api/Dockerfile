# Etapa de build
FROM node:18 AS builder

WORKDIR /api

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código e executa o build
COPY . .
RUN npm run build

# Etapa final (produção)
FROM node:18

WORKDIR /api

# Copia apenas os arquivos necessários
COPY package*.json ./
RUN npm install --production

# Copia os arquivos gerados na build
COPY --from=builder /api/dist ./dist

# Expõe a porta usada pela aplicação
EXPOSE 3333

# Garante que o Node escute em 0.0.0.0 (depende do código também)
CMD ["node", "dist/server.js"]
