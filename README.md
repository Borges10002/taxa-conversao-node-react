# 📊 Conversão por Canal - API

Projeto técnico para análise da taxa de conversão por canal, desenvolvido com foco em performance e organização de código. Utiliza tecnologias modernas tanto no backend quanto no frontend.

---

## 🛠️ Tecnologias Utilizadas

### Backend

- **Node.js** com **TypeScript**
- **Fastify** — servidor leve e rápido
- **Zod** — validação de esquemas
- **Prisma ORM** — acesso ao banco de dados PostgreSQL
- **Vite** — para build e execução mais rápidos durante o desenvolvimento
- **Swagger** — documentação interativa da API

### Frontend

- **React** com **TypeScript**
- **Tailwind CSS** — estilização moderna e produtiva

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- Docker (para subir banco PostgreSQL com volume)

### Clone o projeto

```bash
git clone https://github.com/Borges10002/taxa-conversao-node-react.git
cd taxa-conversao-node-react
```

### 🧠 Decisões de Arquitetura

Fastify foi escolhido pela sua performance superior em relação ao Express e integração natural com validação Zod.

Zod permite garantir contratos seguros entre backend e frontend, aproveitando o type inference do TypeScript.

Prisma facilita a modelagem e integração com o PostgreSQL, além de já fornecer tipagem forte.

Swagger foi integrado para permitir testes e documentação interativa, essencial para times e evolução futura.

React + Tailwind no frontend permitem construir uma UI responsiva e altamente customizável com produtividade.

### Documentação da API com Swagger

🔎 Por que Swagger?
O Swagger (via plugin fastify-swagger ou @fastify/swagger) foi escolhido para documentar a API REST de forma automática e interativa. Isso permite que outros desenvolvedores ou membros do time:

Visualizem os endpoints disponíveis

Testem as rotas diretamente no navegador

Entendam os contratos (input/output) definidos com Zod

🌐 Acessando a documentação
Após subir a API, você pode acessar:
http://localhost:3333/docs
Lá é possível testar os endpoints, ver os exemplos de request/response e confirmar que os contratos Zod estão sendo seguidos.

### ⚖️ Trade-offs

Decidimos manter a estrutura simples e objetiva, priorizando performance e legibilidade, sem frameworks de abstração.

O uso do Zod direto nos endpoints evita necessidade de DTOs separados, mas exige atenção para manter a tipagem sincronizada.

O SQL de seed foi tratado localmente devido ao seu tamanho elevado (não incluído no repositório por restrição do GitHub).
