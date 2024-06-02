"use server";

import { db } from "~/db/db";
import { Input, minValue, number, object, parse } from "valibot";

const getDriverPropsValidation = object({
  driverId: number([minValue(1)]),
});

type GetDriverProps = Input<typeof getDriverPropsValidation>;

export const getDriver = (_props: GetDriverProps) => {
  const props = parse(getDriverPropsValidation, _props);

  return db.query.driverSchema.findFirst({
    where: (driver, { eq }) => eq(driver.id, props.driverId),
  });
};
