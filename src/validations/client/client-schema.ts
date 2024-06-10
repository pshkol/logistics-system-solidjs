import { InferInput, minLength, object, string, pipe } from "valibot"

export const ClientSchema = object({
  name: pipe(string("El nombre es requerido"), minLength(1, "El nombre debe tener al menos 1 caracter") ,),
});

export type ClientSchema = InferInput<typeof ClientSchema>;
