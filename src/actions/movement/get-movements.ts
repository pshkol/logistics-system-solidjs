"use server";

import { db } from "~/db/db";
import { movementSchema } from "~/db/schema";
import { count, desc } from "drizzle-orm";
import { PaginationState } from "@tanstack/solid-table";

export const getMovements = async (pagination?: PaginationState) => {
  const [movements, movementsCount] = await Promise.all([
    db.query.movementSchema.findMany({
      orderBy: [desc(movementSchema.createdAt)],
      offset: (pagination?.pageIndex ?? 0) * (pagination?.pageSize ?? 0),
      limit: pagination?.pageSize,
      with: {
        movementType: true,
      },
    }),
    db
      .select({
        count: count(),
      })
      .from(movementSchema)
      .then((res) => res[0].count),
  ]);

  return {
    data: movements,
    pageCount: Math.ceil(
      pagination?.pageSize
        ? Math.ceil(movementsCount / pagination.pageSize)
        : 0,
    ),
  };
};

export type GetMovementsOutput = Awaited<ReturnType<typeof getMovements>>;
