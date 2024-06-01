"use server";

import { PaginationState } from "@tanstack/solid-table";
import { db } from "~/db/db";
import { count, desc } from "drizzle-orm";
import { movementTypeSchema } from "~/db/schema";

export const getMovementTypes = async (pagination?: PaginationState) => {
  const [data, typesCount] = await Promise.all([
    db.query.movementTypeSchema.findMany({
      orderBy: [desc(movementTypeSchema.createdAt)],
      offset: (pagination?.pageIndex ?? 0) * (pagination?.pageSize ?? 0),
      limit: pagination?.pageSize,
    }),
    db
      .select({
        count: count(),
      })
      .from(movementTypeSchema)
      .then((res) => res[0].count),
  ]);

  return {
    data,
    pageCount: Math.ceil(
      pagination?.pageSize ? Math.ceil(typesCount / pagination.pageSize) : 0,
    ),
  };
};

export type GetMovementTypesOutput = Awaited<
  ReturnType<typeof getMovementTypes>
>;
