import { Input, minValue, number, object } from "valibot";

export const DriverMovementPaymentSchema = object({
  driverId: number([minValue(1)]),
  movementTypeId: number([minValue(1)]),
  cost: number("El costo es requerido", [
    minValue(0, "El costo debe ser mayor a 0"),
  ]),
});

export type DriverMovementPaymentSchema = Input<
  typeof DriverMovementPaymentSchema
>;
