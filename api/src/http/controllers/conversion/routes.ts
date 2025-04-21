import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { createConversionEvolution } from "./create";
import { getConversionEvolution } from "./search";

export async function conversionRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/api/conversion",
    {
      schema: {
        summary: "Get conversion evolution by channel",
        tags: ["conversions"],
        querystring: z.object({
          channel: z.string().optional(),
          status: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
        }),
        response: {
          200: z.object({
            conversion: z
              .array(
                z.object({
                  date: z.string(),
                  total_sent: z.number(),
                  total_viewed: z.number(),
                  conversion_rate: z.number(),
                  channel: z.string(),
                })
              )
              .optional(),
          }),
        },
      },
    },
    getConversionEvolution
  );

  app.withTypeProvider<ZodTypeProvider>().post(
    "/api/conversions",
    {
      schema: {
        summary: "Create a new conversion",
        tags: ["conversions"],
        body: z.object({
          id: z.number(),
          origin: z.string(),
          response_status_id: z.number(),
        }),
        response: {
          201: z.object({
            message: z.string(),
            entity: z.object({
              id: z.string(), // Para o BigInt, podemos representá-lo como string
              origin: z.string(),
              response_status_id: z.number(),
              created_at: z.string(),
            }),
          }),
        },
      },
    },
    createConversionEvolution // Função para processar a criação da conversão
  );
}
