"use server";

import { db } from "~/db/db";
import { desc } from "drizzle-orm";
import { driverMovementPaymentSchema } from "~/db/schema";

export const getDriverCurrentPayment = async (
  driverId: number,
  movementTypeId: number,
) => {
  return db.query.driverMovementPaymentSchema.findFirst({
    where: (driverMovementPayment, { eq }) =>
      eq(driverMovementPayment.driverId, driverId) &&
      eq(driverMovementPayment.movementTypeId, movementTypeId),
    orderBy: [desc(driverMovementPaymentSchema.createdAt)],
  });
};
