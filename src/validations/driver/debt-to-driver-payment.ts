import {
  check,
  forward,
  InferInput,
  minValue,
  number,
  object,
  pipe,
} from "valibot";

export const DebtToDriverPaymentSchema = pipe(
  object({
    driverId: pipe(number(), minValue(1)),
    debtToDriverId: pipe(number(), minValue(1)),
    maxPaymentAmount: pipe(number(), minValue(0)),
    paymentAmount: pipe(
      number("El monto del pago es requerido"),
      minValue(0.01, "El monto del pago debe ser mayor a 0"),
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

export type DebtToDriverPaymentSchema = InferInput<
  typeof DebtToDriverPaymentSchema
>;
