import { ColumnDef } from "@tanstack/solid-table";
import { GetClientDebtsOutput } from "~/actions/client/get-client-debts";
import { format, fromUnixTime } from "date-fns";

export const clientDebtsTableColumns: ColumnDef<
  GetClientDebtsOutput[number]
>[] = [
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
    header: "Monto",
    cell: ({ row }) =>
      new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(row.original.amount),
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de creación",
    cell: ({ row }) => format(fromUnixTime(row.original.createdAt), "PPp"),
  },
];
