import { ColumnDef } from "@tanstack/solid-table";
import { GetClientsOutput } from "~/actions/client/get-clients";
import { format, fromUnixTime } from "date-fns";

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
    cell: ({ row }) => format(fromUnixTime(row.original.createdAt), "PPp"),
  },
];
