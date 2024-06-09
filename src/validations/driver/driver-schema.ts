import { InferInput, minLength, object, string, pipe } from "valibot"

export const DriverSchema = object({
  name: pipe(string("El nombre es requerido"), minLength(1, "El nombre debe tener al menos 1 caracter") ,),
  lastName: pipe(string("El apellido es requerido"), minLength(1, "El apellido debe tener al menos 1 caracter") ,),
});

export type DriverSchema = InferInput<typeof DriverSchema>;
