import {
  coerce,
  Input,
  minValue,
  number,
  object,
  optional,
  string,
} from "valibot";

export const MovementSchema = object({
  description: optional(string()),
  movementTypeId: number("El tipo de movimiento es requerido", [minValue(1)]),
  amount: coerce(
    number("El monto es requerido", [
      minValue(0.01, "El monto debe ser mayor a 0"),
    ]),
    Number,
  ),
});

export type MovementSchema = Input<typeof MovementSchema>;
