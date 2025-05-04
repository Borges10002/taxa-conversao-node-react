import { env } from "@/env";
import { conversionRoutes } from "@/http/controllers/conversion/routes";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastify from "fastify";
import { ZodError } from "zod";

import fastifySwaggerUI from "@fastify/swagger-ui";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

export const app = fastify();

app.register(fastifyCors, {
  origin: "*",
  credentials: true,
});

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "Conversions",
      description:
        "Especificações da API para o back-end da aplicação: Evolução Temporal de taxa de conversão",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

app.get("/health", async () => {
  return { status: "ok" };
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(conversionRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "Internal server error." });
});
