import { PrismaConversionRepository } from "@/repositories/prisma/prisma-conversion-repository";
import { SearchConversionUseCase } from "../search-conversion";

export function makeConversionUseCase() {
  const conversionRepository = new PrismaConversionRepository();

  const useCase = new SearchConversionUseCase(conversionRepository);

  return useCase;
}
