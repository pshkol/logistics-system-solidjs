import { ColumnDef } from "@tanstack/solid-table";
import { GetClientDebtsOutput } from "~/actions/client/get-client-debts";
import { format } from "date-fns";
import AddClientPaymentDialog from "~/components/client/driver-details/add-client-payment-dialog";

type GetClientDebtsTableColumnsProps = {
  onPaymentAdded: () => void;
};

export const getClientDebtsTableColumns = (
  props: GetClientDebtsTableColumnsProps,
): ColumnDef<GetClientDebtsOutput[number]>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "movementId",
    header: "ID de movimiento",
  },
  {
    id: "amount",
    header: "Deuda inicial",
    cell: ({ row }) =>
      new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(row.original.amount),
  },
  {
    id: "actualDebt",
    header: "Deuda actual",
    cell: ({ row }) => {
      const currentDebt =
        row.original.amount -
        row.original.payments.reduce((acc, payment) => acc + payment.amount, 0);

      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(currentDebt);
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de creación",
    cell: ({ row }) => format(row.original.createdAt, "PPp"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const currentDebt =
        row.original.amount -
        row.original.payments.reduce((acc, payment) => acc + payment.amount, 0);

      if (currentDebt === 0) {
        return null;
      }

      return (
        <AddClientPaymentDialog
          clientId={row.original.clientId}
          clientDebtId={row.original.id}
          onPaymentAdded={props.onPaymentAdded}
          maxPaymentAmount={currentDebt}
        />
      );
    },
  },
];
