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

// src/repositories/in-memory/in-memory-conversion-repository.ts
var in_memory_conversion_repository_exports = {};
__export(in_memory_conversion_repository_exports, {
  InMemoryConversionRepository: () => InMemoryConversionRepository
});
module.exports = __toCommonJS(in_memory_conversion_repository_exports);

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

// src/repositories/in-memory/in-memory-conversion-repository.ts
var import_node_crypto = require("crypto");
var InMemoryConversionRepository = class {
  constructor() {
    this.items = [];
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
    const event = {
      id: data.id ?? (0, import_node_crypto.randomUUID)(),
      origin: data.origin ?? null,
      response_status_id: data.response_status_id ?? null,
      created_at: /* @__PURE__ */ new Date()
    };
    this.items.push(event);
    return event;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryConversionRepository
});
//# sourceMappingURL=in-memory-conversion-repository.js.map