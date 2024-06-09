"use server";

import { db } from "~/db/db";
import { InferInput, minValue, number, object, parse, pipe } from "valibot";
import { desc } from "drizzle-orm";
import { clientDebtSchema } from "~/db/schema";

const getClientDebtsPropsValidation = object({
  clientId: pipe(number(), minValue(1)),
});

type GetClientDebtsProps = InferInput<typeof getClientDebtsPropsValidation>;

export const getClientDebts = (_props: GetClientDebtsProps) => {
  const props = parse(getClientDebtsPropsValidation, _props);

  return db.query.clientDebtSchema.findMany({
    orderBy: [desc(clientDebtSchema.createdAt)],
    where: (client, { eq }) => eq(client.clientId, props.clientId),
  });
};

export type GetClientDebtsOutput = Awaited<ReturnType<typeof getClientDebts>>;
