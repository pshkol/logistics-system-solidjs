"use server";

import { db } from "~/db/db";
import { PaginationState } from "@tanstack/solid-table";
import { driverSchema } from "~/db/schema";
import { count, desc, eq } from "drizzle-orm";

type GetDriversInput = {
  active?: boolean;
} & PaginationState;

export const getDrivers = async (props: GetDriversInput) => {
  const [drivers, driversCount] = await Promise.all([
    db.query.driverSchema.findMany({
      orderBy: [desc(driverSchema.createdAt)],
      offset: (props?.pageIndex ?? 0) * (props?.pageSize ?? 0),
      limit: props?.pageSize,
      where: props.active ? eq(driverSchema.active, props.active) : undefined,
    }),
    db
      .select({
        count: count(),
      })
      .from(driverSchema)
      .where(props.active ? eq(driverSchema.active, props.active) : undefined)
      .then((res) => res[0].count),
  ]);
  return {
    data: drivers,
    pageCount: Math.ceil(driversCount / (props?.pageSize ?? 0)),
  };
};

export type GetDriversOutput = Awaited<ReturnType<typeof getDrivers>>;
