import { ColumnDef } from "@tanstack/solid-table";
import { GetDebtsToDriverOutput } from "~/actions/driver/get-debts-to-driver";

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
    cell: ({ row }) => new Date(row.original.createdAt!).toLocaleString(),
  },
];
