"use server";

import { db } from "~/db/db";
import { desc } from "drizzle-orm";
import { debtToDriverSchema } from "~/db/schema";

export function getDebtsToDriver(driverId: number) {
  "use server";
  return db.query.debtToDriverSchema.findMany({
    orderBy: [desc(debtToDriverSchema.createdAt)],
    where: (debtToDriver, { eq }) => eq(debtToDriver.driverId, driverId),
    with: {
      paymentsToDriver: true,
    },
  });
}

export type GetDebtsToDriverOutput = Awaited<
  ReturnType<typeof getDebtsToDriver>
>;
