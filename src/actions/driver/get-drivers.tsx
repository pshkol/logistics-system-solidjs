"use server";

import { db } from "~/db/db";
import { PaginationState } from "@tanstack/solid-table";
import { driverSchema } from "~/db/schema";
import { count, desc } from "drizzle-orm";

export const getDrivers = async (pagination?: PaginationState) => {
  const [drivers, driversCount] = await Promise.all([
    db.query.driverSchema.findMany({
      orderBy: [desc(driverSchema.createdAt)],
      offset: (pagination?.pageIndex ?? 0) * (pagination?.pageSize ?? 0),
      limit: pagination?.pageSize,
    }),
    db
      .select({
        count: count(),
      })
      .from(driverSchema)
      .then((res) => res[0].count),
  ]);

  return {
    data: drivers,
    pageCount: Math.ceil(driversCount / (pagination?.pageSize ?? 0)),
  };
};

export type GetDriversOutput = Awaited<ReturnType<typeof getDrivers>>;
