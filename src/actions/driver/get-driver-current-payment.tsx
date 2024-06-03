"use server";

import { db } from "~/db/db";
import { desc } from "drizzle-orm";
import { driverMovementPaymentSchema } from "~/db/schema";

export const getDriverCurrentPayment = async (driverId: number) => {
  return db.query.driverMovementPaymentSchema.findFirst({
    where: (driverMovementPayment, { eq }) =>
      eq(driverMovementPayment.driverId, driverId),
    orderBy: [desc(driverMovementPaymentSchema.createdAt)],
  });
};
