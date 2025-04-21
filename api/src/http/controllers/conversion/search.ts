import { makeConversionUseCase } from "@/use-cases/factories/make-search-conversion-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { string, z } from "zod";

export async function getConversionEvolution(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const conversionQuerySchema = z.object({
    channel: string().optional(),
    status: string().optional(),
    startDate: string().optional(),
    endDate: string().optional(),
  });

  const { channel, endDate, startDate, status } = conversionQuerySchema.parse(
    request.query
  );

  const searchConversionUseCase = makeConversionUseCase();

  const { conversion } = await searchConversionUseCase.execute({
    channel: String(channel),
    status: String(status),
    endDate: String(endDate),
    startDate: String(startDate),
  });

  const formattedConversions = conversion.map((conversion) => ({
    ...conversion,
    date:
      conversion.date instanceof Date
        ? conversion.date.toISOString()
        : conversion.date, // Converte para string ISO se for um objeto Date
  }));

  return reply.status(200).send({ conversion: formattedConversions });
}
