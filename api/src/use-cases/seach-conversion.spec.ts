import { InMemoryConversionRepository } from "@/repositories/in-memory/in-memory-conversion-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { SearchConversionUseCase } from "./search-conversion";

let conversionRepository: InMemoryConversionRepository;
let sut: SearchConversionUseCase;

describe("Search Conversion Use Case", () => {
  beforeEach(async () => {
    conversionRepository = new InMemoryConversionRepository();
    sut = new SearchConversionUseCase(conversionRepository);
  });

  it("shold be able to search for conversion", async () => {
    await conversionRepository.create({
      origin: "email",
      response_status_id: 5,
    });

    await conversionRepository.create({
      origin: "MOBILE",
      response_status_id: 5,
    });

    const { conversion } = await sut.execute({
      channel: "",
      status: "",
      startDate: "",
      endDate: "",
    });

    expect(conversion).toHaveLength(3);
    expect(conversion).toEqual(
      expect.arrayContaining([expect.objectContaining({ channel: "email" })])
    );
  });
});
