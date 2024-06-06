import {
  Input,
  minLength,
  object,
  picklist,
  string,
  boolean,
  forward,
  custom,
} from "valibot";
import { MovementDirectionTypeEnum } from "~/db/schema";

export const MovementTypeSchema = object(
  {
    name: string("El nombre es requerido", [
      minLength(1, "El nombre debe tener al menos 1 caracter"),
    ]),
    type: picklist(MovementDirectionTypeEnum, "El tipo es requerido"),
    isDriverRequired: boolean("El campo es requerido"),
    isClientRequired: boolean("El campo es requerido"),
    doCreateClientDebt: boolean("El campo es requerido"),
  },
  [
    forward(
      // Requires client if doCreateClientDebt is true
      custom((data) => {
        if (!data.doCreateClientDebt) return true;
        return data.isClientRequired;
      }),
      ["isClientRequired"],
    ),
  ],
);

export type MovementTypeSchema = Input<typeof MovementTypeSchema>;
