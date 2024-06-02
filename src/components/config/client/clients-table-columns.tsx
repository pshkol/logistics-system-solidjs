import { ColumnDef } from "@tanstack/solid-table";
import { GetClientsOutput } from "~/actions/client/get-clients";

export const clientsTableColumns: ColumnDef<
  GetClientsOutput["data"][number]
>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    id: "createdAt",
    header: "Fecha de creación",
    cell: ({ row }) => new Date(row.original.createdAt!).toLocaleString(),
  },
];
