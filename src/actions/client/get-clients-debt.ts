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

const getClientsDebtSchema = object({
  endDate: optional(pipe(string(), isoDate())),
});

export type GetClientsDebtInput = InferInput<typeof getClientsDebtSchema>;

export const getClientsDebt = async (_props?: GetClientsDebtInput) => {
  const props = parse(getClientsDebtSchema, _props);

  const clients = await db.query.clientDebtSchema.findMany({
    with: {
      payments: true,
    },
    where: (debt, { lt }) =>
      props?.endDate
        ? lt(debt.createdAt, add(new Date(props.endDate), { days: 1 }))
        : undefined,
  });
  return clients.reduce(
    (acc, client) =>
      acc +
      Number(client.amount) -
      client.payments.reduce((acc, curr) => acc + curr.amount, 0),
    0,
  );
};
