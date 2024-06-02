import { ColumnDef } from "@tanstack/solid-table";
import { GetDriversOutput } from "~/actions/driver/get-drivers";

export const driversTableColumns: ColumnDef<
  GetDriversOutput["data"][number]
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
    accessorKey: "lastName",
    header: "Apellido",
  },
];
