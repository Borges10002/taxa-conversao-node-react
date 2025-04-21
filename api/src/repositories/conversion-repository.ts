import { Prisma } from "@prisma/client";
import { Event as PrismaEvent } from "@prisma/client";

export interface ConversionRepository {
  findById(id: number): Promise<PrismaEvent | null>;
  getConversionRateOverTime(param: any): Promise<any[]>;
  create(data: Prisma.EventCreateInput): Promise<PrismaEvent>;
}
