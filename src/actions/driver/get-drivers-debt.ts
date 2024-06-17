"use server";

import { db } from "~/db/db";
import {
  InferInput,
  isoDate,
  object,
  optional,
  parse,
  pipe,
  string,
} from "valibot";
import { add } from "date-fns";

const getDriversDebtSchema = object({
  endDate: optional(pipe(string(), isoDate())),
});

export type GetDriversDebtInput = InferInput<typeof getDriversDebtSchema>;

export const getDriversDebt = async (_props?: GetDriversDebtInput) => {
  const props = parse(getDriversDebtSchema, _props);

  const [drivers, paymentsToDrivers] = await Promise.all([
    db.query.debtToDriverSchema.findMany({
      where: (debt, { lt }) =>
        props?.endDate
          ? lt(debt.createdAt, add(new Date(props.endDate), { days: 1 }))
          : undefined,
    }),
    db.query.paymentToDriverSchema.findMany({
      where: (debt, { lt }) =>
        props?.endDate
          ? lt(debt.createdAt, add(new Date(props.endDate), { days: 1 }))
          : undefined,
    }),
  ]);

  const totalPaymentsToDrivers = paymentsToDrivers.reduce(
    (acc, payment) => acc + Number(payment.amount),
    0,
  );

  return (
    drivers.reduce((acc, driver) => acc + Number(driver.amount), 0) -
    totalPaymentsToDrivers
  );
};
