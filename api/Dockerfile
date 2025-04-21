# Usar a imagem oficial do Node.js
FROM node:18-alpine

# Definir o diretório de trabalho no contêiner
WORKDIR /app

# Copiar os arquivos do projeto para o contêiner
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o código-fonte da aplicação
COPY . .

# Expor a porta em que o app vai rodar
EXPOSE 3000

# Rodar o servidor
CMD ["npm", "start"]
