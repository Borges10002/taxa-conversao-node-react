"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/http/controllers/conversion/search.ts
var search_exports = {};
__export(search_exports, {
  getConversionEvolution: () => getConversionEvolution
});
module.exports = __toCommonJS(search_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["dev", "test", "production"]).default("dev"),
  JWT_SECRET: import_zod.z.string(),
  PORT: import_zod.z.coerce.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("\u274C Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables.");
}
var env = _env.data;

// src/lib/prisma.ts
var prisma = new import_client.PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : []
});

// src/repositories/prisma/prisma-conversion-repository.ts
var PrismaConversionRepository = class {
  async findById(id) {
    const ckeckIn = await prisma.event.findUnique({ where: { id } });
    return ckeckIn;
  }
  async getConversionRateOverTime(params) {
    const { channel, status, startDate, endDate } = params;
    const whereConditions = [];
    const queryParams = [];
    if (channel) {
      console.log("aa", channel);
      whereConditions.push(`origin = $${whereConditions.length + 1}`);
      queryParams.push(channel);
    }
    if (status !== void 0 && status !== null && status !== "") {
      whereConditions.push(
        `response_status_id = $${whereConditions.length + 1}`
      );
      queryParams.push(parseInt(status, 10));
    }
    if (startDate) {
      whereConditions.push(
        `created_at >= $${whereConditions.length + 1}::date`
      );
      queryParams.push(startDate);
    }
    if (endDate) {
      whereConditions.push(
        `created_at <= $${whereConditions.length + 1}::date`
      );
      queryParams.push(endDate + " 23:59:59");
    }
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
    const sql = `
      SELECT
        origin AS channel,
        DATE_TRUNC('day', created_at) AS date,
        COUNT(*) FILTER (WHERE response_status_id IN (1, 5, 6)) AS total_sent,
        COUNT(*) FILTER (WHERE response_status_id = 6) AS total_viewed,
        ROUND(
          CASE WHEN COUNT(*) FILTER (WHERE response_status_id IN (1, 5, 6)) > 0
            THEN COUNT(*) FILTER (WHERE response_status_id = 6)::numeric / 
                COUNT(*) FILTER (WHERE response_status_id IN (1, 5, 6)) * 100
            ELSE 0
          END, 2
        ) AS conversion_rate
      FROM "event" e
      ${whereClause}
      GROUP BY channel, date
      ORDER BY date ASC
    `;
    return await prisma.$queryRawUnsafe(sql, ...queryParams);
  }
  async create(data) {
    const event = await prisma.event.create({ data });
    return event;
  }
};

// src/use-cases/search-conversion.ts
var SearchConversionUseCase = class {
  constructor(conversionRepository) {
    this.conversionRepository = conversionRepository;
  }
  async execute(params) {
    const result = await this.conversionRepository.getConversionRateOverTime(params);
    const conversion = result.map((row) => ({
      channel: row.channel,
      date: row.date,
      total_sent: Number(row.total_sent),
      total_viewed: Number(row.total_viewed),
      conversion_rate: Number(row.conversion_rate)
    }));
    return {
      conversion
    };
  }
};

// src/use-cases/factories/make-search-conversion-use-case.ts
function makeConversionUseCase() {
  const conversionRepository = new PrismaConversionRepository();
  const useCase = new SearchConversionUseCase(conversionRepository);
  return useCase;
}

// src/http/controllers/conversion/search.ts
var import_zod2 = require("zod");
async function getConversionEvolution(request, reply) {
  const conversionQuerySchema = import_zod2.z.object({
    channel: (0, import_zod2.string)().optional(),
    status: (0, import_zod2.string)().optional(),
    startDate: (0, import_zod2.string)().optional(),
    endDate: (0, import_zod2.string)().optional()
  });
  const { channel, endDate, startDate, status } = conversionQuerySchema.parse(
    request.query
  );
  const searchConversionUseCase = makeConversionUseCase();
  const { conversion } = await searchConversionUseCase.execute({
    channel: String(channel),
    status: String(status),
    endDate: String(endDate),
    startDate: String(startDate)
  });
  const formattedConversions = conversion.map((conversion2) => ({
    ...conversion2,
    date: conversion2.date instanceof Date ? conversion2.date.toISOString() : conversion2.date
    // Converte para string ISO se for um objeto Date
  }));
  return reply.status(200).send({ conversion: formattedConversions });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getConversionEvolution
});
//# sourceMappingURL=search.js.map