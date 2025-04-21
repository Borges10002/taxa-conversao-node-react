const { spawn } = require("child_process");
require("dotenv").config();
const path = require("path");

const { PGUSER, PGPASSWORD, PGDATABASE, SQL_FILE, DOCKER_CONTAINER } =
  process.env;

const sqlPath = path.resolve(SQL_FILE);

console.log("⏳ Importando arquivo SQL grande...");

// Comando formatado para o Docker
const comando = `docker exec -i ${DOCKER_CONTAINER} bash -c "PGPASSWORD=${PGPASSWORD} psql -U ${PGUSER} -d ${PGDATABASE}"`;

// Divide o comando em partes para usar no spawn
const child = spawn(comando, {
  shell: true,
  stdio: ["pipe", "inherit", "inherit"],
});

// Lê o arquivo SQL e envia para o stdin do processo
const fs = require("fs");
const stream = fs.createReadStream(sqlPath);

stream.pipe(child.stdin);

child.on("close", (code) => {
  if (code === 0) {
    console.log("✅ Importação concluída com sucesso!");
  } else {
    console.error(`❌ Processo terminou com código ${code}`);
  }
});
