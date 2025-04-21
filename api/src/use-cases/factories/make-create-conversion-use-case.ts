import { PrismaConversionRepository } from "@/repositories/prisma/prisma-conversion-repository";
import { CreateConversionUseCase } from "../create-conversion";

export function makeCreateConversionUseCase() {
  const conversionRepository = new PrismaConversionRepository();
  const useCase = new CreateConversionUseCase(conversionRepository);

  return useCase;
}
