"use server";

import { db } from "~/db/db";
import { PaginationState } from "@tanstack/solid-table";
import { clientSchema } from "~/db/schema";
import { count, desc } from "drizzle-orm";

export const getClients = async (pagination?: PaginationState) => {
  const [clients, clientsCount] = await Promise.all([
    db.query.clientSchema.findMany({
      orderBy: [desc(clientSchema.createdAt)],
      offset: (pagination?.pageIndex ?? 0) * (pagination?.pageSize ?? 0),
      limit: pagination?.pageSize,
    }),
    db
      .select({
        count: count(),
      })
      .from(clientSchema)
      .then((res) => res[0].count),
  ]);

  return {
    data: clients,
    pageCount: Math.ceil(clientsCount / (pagination?.pageSize ?? 0)),
  };
};

export type GetClientsOutput = Awaited<ReturnType<typeof getClients>>;
