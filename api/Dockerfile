# Usa imagem oficial Node.js
FROM node:18-alpine

# Cria diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante da aplicação
COPY . .

# Expondo a porta (ajuste se necessário)
EXPOSE 3333

# Comando para rodar a API
CMD ["npm", "run", "start"]