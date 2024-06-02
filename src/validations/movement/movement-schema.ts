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
    amount: coerce(
      number("El monto es requerido", [
        minValue(0.01, "El monto debe ser mayor a 0"),
      ]),
      Number,
    ),
    driverId: optional(number()),
  },
  [
    forward(
      custom((data) => {
        if (!data.isDriverRequired) return true;
        return safeParse(number([minValue(1)]), data.driverId).success;
      }, "El conductor es requerido"),
      ["driverId"],
    ),
  ],
);

export type MovementSchema = Input<typeof MovementSchema>;
