FROM node:18 AS builder

WORKDIR /api
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18

WORKDIR /api
COPY package*.json ./
RUN npm install --production
COPY --from=builder /api/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
