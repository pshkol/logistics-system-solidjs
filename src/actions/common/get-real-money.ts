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

const getRealMoneySchema = object({
  endDate: optional(pipe(string(), isoDate())),
});

export type GetRealMoneyInput = InferInput<typeof getRealMoneySchema>;

export const getRealMoney = async (_props?: GetRealMoneyInput) => {
  const props = parse(getRealMoneySchema, _props);

  const [realMoney, paymentsToDrivers, clientPayments] = await Promise.all([
    db.query.movementSchema.findMany({
      with: {
        clientDebt: true,
        movementType: true,
      },
      where: (movement, { lt }) =>
        props?.endDate
          ? lt(movement.createdAt, add(new Date(props.endDate), { days: 1 }))
          : undefined,
    }),
    db.query.paymentToDriverSchema.findMany({
      where: (payment, { lt }) =>
        props?.endDate
          ? lt(payment.createdAt, add(new Date(props.endDate), { days: 1 }))
          : undefined,
    }),
    db.query.clientPaymentSchema.findMany({
      where: (payment, { lt }) =>
        props?.endDate
          ? lt(payment.createdAt, add(new Date(props.endDate), { days: 1 }))
          : undefined,
    }),
  ]);

  const totalPaymentsToDrivers = paymentsToDrivers.reduce(
    (acc, payment) => acc + Number(payment.amount),
    0,
  );

  const totalClientPayments = clientPayments.reduce(
    (acc, payment) => acc + Number(payment.amount),
    0,
  );

  return (
    realMoney.reduce((acc, movement) => {
      if (movement.clientDebt) {
        return acc;
      }
      return movement.movementType?.type === "IN"
        ? acc + Number(movement.amount)
        : acc - Number(movement.amount);
    }, 0) -
    totalPaymentsToDrivers +
    totalClientPayments
  );
};
