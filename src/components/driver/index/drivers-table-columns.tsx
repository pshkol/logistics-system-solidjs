import { ColumnDef } from "@tanstack/solid-table";
import { GetDriversOutput } from "~/actions/driver/get-drivers";
import { FaSolidArrowRight } from "solid-icons/fa";
import { Button } from "~/components/ui/button";
import { A } from "@solidjs/router";

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
  {
    id: "active",
    header: "Activo",
    cell: ({ row }) => {
      return row.original.active ? "Si" : "No";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div class={"flex justify-end"}>
          <Button
            variant={"ghost"}
            class={"w-6"}
            as={A}
            href={`/driver/${row.original.id}`}
          >
            <FaSolidArrowRight size={"18"} />
          </Button>
        </div>
      );
    },
  },
];
