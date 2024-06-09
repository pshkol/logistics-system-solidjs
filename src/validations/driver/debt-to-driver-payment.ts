import { custom, forward, Input, minValue, number, object } from "valibot";

export const DebtToDriverPaymentSchema = object(
  {
    driverId: number([minValue(1)]),
    debtToDriverId: number([minValue(1)]),
    maxPaymentAmount: number([minValue(0)]),
    paymentAmount: number("El monto del pago es requerido", [
      minValue(0.01, "El monto del pago debe ser mayor a 0"),
    ]),
  },
  [
    forward(
      // The payment amount must be less than or equal to the max payment amount
      custom((data) => {
        return data.paymentAmount <= data.maxPaymentAmount;
      }, "El monto del pago no puede ser mayor al monto de la deuda"),
      ["paymentAmount"],
    ),
  ],
);

export type DebtToDriverPaymentSchema = Input<typeof DebtToDriverPaymentSchema>;
