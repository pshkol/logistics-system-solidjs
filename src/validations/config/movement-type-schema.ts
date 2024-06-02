import { Input, minLength, object, picklist, string, boolean } from "valibot";
import { movementDirectionTypeEnum } from "~/db/schema";

export const MovementTypeSchema = object({
  name: string("El nombre es requerido", [
    minLength(1, "El nombre debe tener al menos 1 caracter"),
  ]),
  type: picklist(movementDirectionTypeEnum.enumValues, "El tipo es requerido"),
  isDriverRequired: boolean("El campo es requerido"),
});

export type MovementTypeSchema = Input<typeof MovementTypeSchema>;
