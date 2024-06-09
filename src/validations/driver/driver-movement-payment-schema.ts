import { InferInput, minValue, number, object, pipe } from "valibot"

export const DriverMovementPaymentSchema = object({
  driverId: pipe(number(), minValue(1)),
  movementTypeId: pipe(number(), minValue(1)),
  cost: pipe(number("El costo es requerido"), minValue(0, "El costo debe ser mayor a 0") ,),
});

export type DriverMovementPaymentSchema = InferInput<
  typeof DriverMovementPaymentSchema
>;
