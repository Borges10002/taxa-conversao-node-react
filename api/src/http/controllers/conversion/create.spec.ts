import { app } from "@/app";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Create Event (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a gym", async () => {
    const response = await request(app.server).post("/api/conversions").send({
      id: 999999999999,
      origin: "email",
      response_status_id: 4,
    });

    expect(response.statusCode).toEqual(201);
  });
});
