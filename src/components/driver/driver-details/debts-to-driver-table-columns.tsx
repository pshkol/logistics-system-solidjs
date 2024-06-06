import { ColumnDef } from "@tanstack/solid-table";
import { GetDebtsToDriverOutput } from "~/actions/driver/get-debts-to-driver";
import { format, fromUnixTime } from "date-fns";

export const debtsToDriverTableColumns: ColumnDef<
  GetDebtsToDriverOutput[number]
>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "amount",
    header: "Monto deuda",
    cell: ({ row }) =>
      new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(Number(row.original.amount)),
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
];
