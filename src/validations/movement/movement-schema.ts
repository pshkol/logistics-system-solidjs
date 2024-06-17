import {
  InferInput,
  minValue,
  number,
  object,
  optional,
  string,
  forward,
  check,
  boolean,
  safeParse,
  pipe,
  transform,
} from "valibot";

export const MovementSchema = pipe(
  object({
    description: optional(string()),
    movementTypeId: pipe(
      number("El tipo de movimiento es requerido"),
      minValue(1),
    ),
    isDriverRequired: boolean(),
    isClientRequired: boolean(),
    driverMovementPaymentId: optional(number()),
    driverMovementPaymentAmount: optional(number()),
    amount: pipe(number(), transform(Number)),
    driverId: optional(number()),
    clientId: optional(number()),
  }),
  forward(
    // Requires driver if isDriverRequired is true
    check((data) => {
      if (!data.isDriverRequired) return true;
      return safeParse(pipe(number(), minValue(1)), data.driverId).success;
    }, "El conductor es requerido"),
    ["driverId"],
  ),
  forward(
    // Requires client if isClientRequired is true
    check((data) => {
      if (!data.isClientRequired) return true;
      return safeParse(pipe(number(), minValue(1)), data.clientId).success;
    }, "El cliente es requerido"),
    ["clientId"],
  ),
  forward(
    // Requires driver payment if isDriverRequired is true
    check((data) => {
      if (!data.isDriverRequired) return true;
      return safeParse(
        pipe(number(), minValue(1)),
        data.driverMovementPaymentId,
      ).success;
    }, "El pago del conductor es requerido"),
    ["driverId"],
  ),
);

export type MovementSchema = InferInput<typeof MovementSchema>;
