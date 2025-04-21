import { app } from "@/app";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Search conversions (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search conversions by channel", async () => {
    // Criar eventos com response_status_id igual a 6
    await request(app.server).post("/api/conversion").send({
      origin: "MOBILE",
      response_status_id: 6,
    });

    await request(app.server).post("/api/conversion").send({
      origin: "email",
      response_status_id: 6,
    });

    // Requisição para buscar conversões por canal
    const response = await request(app.server)
      .get("/api/conversion")
      .query({ channel: "", status: "", startDate: "", endDate: "" })
      .send();

    // Asserções
    expect(response.statusCode).toEqual(200);
  });
});
