import { Input, minLength, object, string } from "valibot";

export const DriverSchema = object({
  name: string("El nombre es requerido", [
    minLength(1, "El nombre debe tener al menos 1 caracter"),
  ]),
  lastName: string("El apellido es requerido", [
    minLength(1, "El apellido debe tener al menos 1 caracter"),
  ]),
});

export type DriverSchema = Input<typeof DriverSchema>;
