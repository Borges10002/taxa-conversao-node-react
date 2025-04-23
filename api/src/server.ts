import { app } from "./app";
import { env } from "./env";

app
  .listen({
    port: 3333,
    host: "0.0.0.0", // <- ESSENCIAL PARA FLY.IO
  })
  .then(() => {
    console.log(`🚀 HTTP Server Running - ${env.PORT}!`);
  });
