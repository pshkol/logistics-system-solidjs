import { ColumnDef } from "@tanstack/solid-table";
import { GetMovementTypesOutput } from "~/actions/movement-type/get-movement-types";

export const movementTypeTable: ColumnDef<
  GetMovementTypesOutput["data"][number]
>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "type",
    header: "Tipo",
    cell: ({ row }) => (row.original.type === "IN" ? "Ingreso" : "Gasto"),
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
];
