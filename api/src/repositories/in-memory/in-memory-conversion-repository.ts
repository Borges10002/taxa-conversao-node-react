import { prisma } from "@/lib/prisma";
import { Prisma, Event as PrismaEvent } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { ConversionRepository } from "../conversion-repository";

export class InMemoryConversionRepository implements ConversionRepository {
  public items: PrismaEvent[] = [];

  async getConversionRateOverTime(params: {
    channel?: string | null;
    status?: string | null;
    startDate?: string | null;
    endDate?: string | null;
  }): Promise<any[]> {
    const { channel, status, startDate, endDate } = params;

    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    // Adiciona condições apenas se os valores forem válidos
    if (channel) {
      console.log("aa", channel);
      whereConditions.push(`origin = $${whereConditions.length + 1}`);
      queryParams.push(channel);
    }

    if (status !== undefined && status !== null && status !== "") {
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
      queryParams.push(endDate + " 23:59:59"); // Inclui todo o dia
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

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

    return await prisma.$queryRawUnsafe<any[]>(sql, ...queryParams);
  }

  async create(data: Prisma.EventCreateInput): Promise<PrismaEvent> {
    const event = {
      id: data.id ?? randomUUID(),
      origin: data.origin ?? null,
      response_status_id: data.response_status_id ?? null,
      created_at: new Date(),
    } as any;

    this.items.push(event);

    return event;
  }
}
