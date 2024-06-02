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
    id: "actions",
    cell: ({ row }) => {
      return (
        <Button
          variant={"ghost"}
          class={"w-6"}
          as={A}
          href={`/config/driver/${row.original.id}`}
        >
          <FaSolidArrowRight size={"18"} />
        </Button>
      );
    },
  },
];
