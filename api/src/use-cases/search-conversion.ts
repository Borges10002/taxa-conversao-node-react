import { ConversionRepository } from "@/repositories/conversion-repository";

interface Request {
  channel: string;
  endDate: string;
  startDate: string;
  status: string;
}

interface SearchConversioUseCaseResponse {
  conversion: any[];
}

export class SearchConversionUseCase {
  constructor(private conversionRepository: ConversionRepository) {}

  async execute(params: Request): Promise<SearchConversioUseCaseResponse> {
    const result =
      await this.conversionRepository.getConversionRateOverTime(params);

    const conversion = result.map((row) => ({
      channel: row.channel,
      date: row.date,
      total_sent: Number(row.total_sent),
      total_viewed: Number(row.total_viewed),
      conversion_rate: Number(row.conversion_rate),
    }));

    return {
      conversion,
    };
  }
}
