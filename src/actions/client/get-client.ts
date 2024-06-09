"use server";

import { db } from "~/db/db";
import { InferInput, minValue, number, object, parse, pipe } from "valibot";

const getClientPropsValidation = object({
  clientId: pipe(number(), minValue(1)),
});

type GetClientProps = InferInput<typeof getClientPropsValidation>;

export const getClient = (_props: GetClientProps) => {
  const props = parse(getClientPropsValidation, _props);

  return db.query.clientSchema.findFirst({
    where: (client, { eq }) => eq(client.id, props.clientId),
  });
};
