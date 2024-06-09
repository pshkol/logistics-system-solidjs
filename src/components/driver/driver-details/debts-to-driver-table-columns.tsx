import { ColumnDef } from "@tanstack/solid-table";
import { GetDebtsToDriverOutput } from "~/actions/driver/get-debts-to-driver";
import { format, fromUnixTime } from "date-fns";
import AddDebtToProviderPaymentDialog from "~/components/driver/driver-details/add-debt-to-provider-payment-dialog";

type getDebtsToDriverTableColumnsProps = {
  onPaymentAdded: () => void;
};

export function getDebtsToDriverTableColumns(
  props: getDebtsToDriverTableColumnsProps,
): ColumnDef<GetDebtsToDriverOutput[number]>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      id: "initialDebt",
      header: "Deuda inicial",
      cell: ({ row }) =>
        new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(Number(row.original.amount)),
    },
    {
      id: "actualDebt",
      header: "Deuda actual",
      cell: ({ row }) => {
        const currentDebtToDriver =
          row.original.amount -
          row.original.paymentsToDriver.reduce(
            (acc, payment) => acc + payment.amount,
            0,
          );

        return new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(currentDebtToDriver);
      },
    },
    {
      accessorKey: "movementId",
      header: "Movimiento",
    },
    {
      accessorKey: "createdAt",
      header: "Fecha creación",
      cell: ({ row }) => format(fromUnixTime(row.original.createdAt), "PPp"),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const currentDebtToDriver =
          row.original.amount -
          row.original.paymentsToDriver.reduce(
            (acc, payment) => acc + payment.amount,
            0,
          );

        if (currentDebtToDriver === 0) {
          return null;
        }

        return (
          <AddDebtToProviderPaymentDialog
            maxPaymentAmount={Number(row.original.amount)}
            driverId={row.original.driverId}
            debtToDriverId={row.original.id}
            onPaymentAdded={props.onPaymentAdded}
          />
        );
      },
    },
  ];
}
