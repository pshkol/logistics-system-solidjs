import {
  coerce,
  Input,
  minValue,
  number,
  object,
  optional,
  string,
  forward,
  custom,
  boolean,
  safeParse,
} from "valibot";

export const MovementSchema = object(
  {
    description: optional(string()),
    movementTypeId: number("El tipo de movimiento es requerido", [minValue(1)]),
    isDriverRequired: boolean(),
    isClientRequired: boolean(),
    amount: coerce(
      number("El monto es requerido", [
        minValue(0.01, "El monto debe ser mayor a 0"),
      ]),
      Number,
    ),
    driverId: optional(number()),
    clientId: optional(number()),
  },
  [
    forward(
      // Requires driver if isDriverRequired is true
      custom((data) => {
        if (!data.isDriverRequired) return true;
        return safeParse(number([minValue(1)]), data.driverId).success;
      }, "El conductor es requerido"),
      ["driverId"],
    ),
    forward(
      // Requires client if isClientRequired is true
      custom((data) => {
        if (!data.isClientRequired) return true;
        return safeParse(number([minValue(1)]), data.clientId).success;
      }, "El cliente es requerido"),
      ["clientId"],
    ),
  ],
);

export type MovementSchema = Input<typeof MovementSchema>;
