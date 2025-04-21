"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/http/controllers/conversion/routes.ts
var routes_exports = {};
__export(routes_exports, {
  conversionRoutes: () => conversionRoutes
});
module.exports = __toCommonJS(routes_exports);
var import_zod4 = __toESM(require("zod"));

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
  log: env.NODE_ENV === "dev" ? ["error"] : []
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

// src/use-cases/errors/id-already-exists.ts
var IdAlreadyExists = class extends Error {
  constructor() {
    super("id already exists");
  }
};

// src/use-cases/create-conversion.ts
var CreateConversionUseCase = class {
  constructor(conversionRepository) {
    this.conversionRepository = conversionRepository;
  }
  async execute({
    id,
    origin,
    response_status_id
  }) {
    const ev = await this.conversionRepository.findById(id);
    console.log(ev);
    if (ev) {
      throw new IdAlreadyExists();
    }
    const event = await this.conversionRepository.create({
      id,
      origin,
      response_status_id
    });
    return { event };
  }
};

// src/use-cases/factories/make-create-conversion-use-case.ts
function makeCreateConversionUseCase() {
  const conversionRepository = new PrismaConversionRepository();
  const useCase = new CreateConversionUseCase(conversionRepository);
  return useCase;
}

// src/http/controllers/conversion/create.ts
var import_zod2 = require("zod");
async function createConversionEvolution(request, reply) {
  const registerBodySchema = import_zod2.z.object({
    id: import_zod2.z.number(),
    origin: import_zod2.z.string(),
    response_status_id: import_zod2.z.number()
  });
  const { id, origin, response_status_id } = registerBodySchema.parse(
    request.body
  );
  const createConversionUseCase = makeCreateConversionUseCase();
  await createConversionUseCase.execute({
    id,
    origin,
    response_status_id
  });
  return reply.status(201).send();
}

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
var import_zod3 = require("zod");
async function getConversionEvolution(request, reply) {
  const conversionQuerySchema = import_zod3.z.object({
    channel: (0, import_zod3.string)().optional(),
    status: (0, import_zod3.string)().optional(),
    startDate: (0, import_zod3.string)().optional(),
    endDate: (0, import_zod3.string)().optional()
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

// src/http/controllers/conversion/routes.ts
async function conversionRoutes(app) {
  app.withTypeProvider().get(
    "/api/conversion",
    {
      schema: {
        summary: "Get conversion evolution by channel",
        tags: ["conversions"],
        querystring: import_zod4.default.object({
          channel: import_zod4.default.string().optional(),
          status: import_zod4.default.string().optional(),
          startDate: import_zod4.default.string().optional(),
          endDate: import_zod4.default.string().optional()
        }),
        response: {
          200: import_zod4.default.object({
            conversion: import_zod4.default.array(
              import_zod4.default.object({
                date: import_zod4.default.string(),
                total_sent: import_zod4.default.number(),
                total_viewed: import_zod4.default.number(),
                conversion_rate: import_zod4.default.number(),
                channel: import_zod4.default.string()
              })
            ).optional()
          })
        }
      }
    },
    getConversionEvolution
  );
  app.withTypeProvider().post(
    "/api/conversions",
    {
      schema: {
        summary: "Create a new conversion",
        tags: ["conversions"],
        body: import_zod4.default.object({
          id: import_zod4.default.number(),
          origin: import_zod4.default.string(),
          response_status_id: import_zod4.default.number()
        }),
        response: {
          201: import_zod4.default.object({
            message: import_zod4.default.string(),
            entity: import_zod4.default.object({
              id: import_zod4.default.string(),
              // Para o BigInt, podemos representá-lo como string
              origin: import_zod4.default.string(),
              response_status_id: import_zod4.default.number(),
              created_at: import_zod4.default.string()
            })
          })
        }
      }
    },
    createConversionEvolution
    // Função para processar a criação da conversão
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  conversionRoutes
});
//# sourceMappingURL=routes.js.map