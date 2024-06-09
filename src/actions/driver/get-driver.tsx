"use server";

import { db } from "~/db/db";
import { InferInput, minValue, number, object, parse, pipe } from "valibot"

const getDriverPropsValidation = object({
  driverId: pipe(number(), minValue(1)),
});

type GetDriverProps = InferInput<typeof getDriverPropsValidation>;

export const getDriver = (_props: GetDriverProps) => {
  const props = parse(getDriverPropsValidation, _props);

  return db.query.driverSchema.findFirst({
    where: (driver, { eq }) => eq(driver.id, props.driverId),
  });
};
