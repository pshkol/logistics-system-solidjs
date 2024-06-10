import {
  check,
  forward,
  InferInput,
  isoDate,
  maxValue,
  minValue,
  number,
  object,
  pipe,
  string,
} from "valibot";
import { format } from "date-fns";

export const ClientPaymentSchema = pipe(
  object({
    clientId: pipe(number(), minValue(1)),
    clientDebtId: pipe(number(), minValue(1)),
    maxPaymentAmount: pipe(number(), minValue(0)),
    paymentAmount: pipe(
      number("El monto del pago es requerido"),
      minValue(0.01, "El monto del pago debe ser mayor a 0"),
    ),
    date: pipe(
      string("La fecha del pago es requerida"),
      isoDate("Fecha inválida"),
      maxValue(
        format(new Date(), "yyyy-MM-dd"),
        "La fecha del pago no puede ser mayor a la fecha actual",
      ),
    ),
  }),
  forward(
    // The payment amount must be less than or equal to the max payment amount
    check((data) => {
      return data.paymentAmount <= data.maxPaymentAmount;
    }, "El monto del pago no puede ser mayor al monto de la deuda"),
    ["paymentAmount"],
  ),
);

export type ClientPaymentSchema = InferInput<typeof ClientPaymentSchema>;
