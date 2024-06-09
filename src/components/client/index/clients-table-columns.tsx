import { ColumnDef } from "@tanstack/solid-table";
import { GetClientsOutput } from "~/actions/client/get-clients";
import { format, fromUnixTime } from "date-fns";
import { Button } from "~/components/ui/button";
import { A } from "@solidjs/router";
import { FaSolidArrowRight } from "solid-icons/fa";

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
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div class={"flex justify-end"}>
          <Button
            variant={"ghost"}
            class={"w-6"}
            as={A}
            href={`/client/${row.original.id}`}
          >
            <FaSolidArrowRight size={"18"} />
          </Button>
        </div>
      );
    },
  },
];
