import { Input, minLength, object, string } from "valibot";

export const ClientSchema = object({
  name: string("El nombre es requerido", [
    minLength(1, "El nombre debe tener al menos 1 caracter"),
  ]),
});

export type ClientSchema = Input<typeof ClientSchema>;
