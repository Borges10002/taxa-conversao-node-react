import { ConversionRepository } from "@/repositories/conversion-repository";
import { Event as PrismaEvent } from "@prisma/client";
import { IdAlreadyExists } from "./errors/id-already-exists";

interface CreateConversionUseCaseRequest {
  id: number;
  origin: string;
  response_status_id: number;
}

interface CreateConversionUseCaseResponse {
  event: PrismaEvent;
}

export class CreateConversionUseCase {
  constructor(private conversionRepository: ConversionRepository) {}

  async execute({
    id,
    origin,
    response_status_id,
  }: CreateConversionUseCaseRequest): Promise<CreateConversionUseCaseResponse> {
    const ev = await this.conversionRepository.findById(id);

    console.log(ev);

    if (ev) {
      throw new IdAlreadyExists();
    }

    const event = await this.conversionRepository.create({
      id,
      origin,
      response_status_id,
    });

    return { event };
  }
}
