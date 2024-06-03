"use server";

import { PaginationState } from "@tanstack/solid-table";
import { db } from "~/db/db";
import { count, desc } from "drizzle-orm";
import { movementTypeSchema } from "~/db/schema";

export type GetMovementTypesInput = {
  isDriverRequired?: boolean;
} & PaginationState;

export const getMovementTypes = async (props: GetMovementTypesInput) => {
  const [data, typesCount] = await Promise.all([
    db.query.movementTypeSchema.findMany({
      where: (movementType, { eq }) =>
        props.isDriverRequired
          ? eq(movementType.isDriverRequired, props.isDriverRequired)
          : undefined,
      orderBy: [desc(movementTypeSchema.createdAt)],
      offset: (props?.pageIndex ?? 0) * (props?.pageSize ?? 0),
      limit: props?.pageSize,
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
      props?.pageSize ? Math.ceil(typesCount / props.pageSize) : 0,
    ),
  };
};

export type GetMovementTypesOutput = Awaited<
  ReturnType<typeof getMovementTypes>
>;
