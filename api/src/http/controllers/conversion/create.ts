import { makeCreateConversionUseCase } from "@/use-cases/factories/make-create-conversion-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function createConversionEvolution(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerBodySchema = z.object({
    id: z.number(),
    origin: z.string(),
    response_status_id: z.number(),
  });

  const { id, origin, response_status_id } = registerBodySchema.parse(
    request.body
  );

  const createConversionUseCase = makeCreateConversionUseCase();

  await createConversionUseCase.execute({
    id,
    origin,
    response_status_id,
  });

  return reply.status(201).send();
}
