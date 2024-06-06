import { ColumnDef } from "@tanstack/solid-table";
import { GetMovementsOutput } from "~/actions/movement/get-movements";
import { FaSolidArrowDown, FaSolidArrowUp } from "solid-icons/fa";
import { format, fromUnixTime } from "date-fns";

export const movementsTableColumns: ColumnDef<
  GetMovementsOutput["data"][number]
>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "amount",
    header: "Monto",
    cell: ({ row }) => {
      return (
        <div class={"flex items-center gap-1"}>
          {row.original.movementType?.type === "IN" ? (
            <FaSolidArrowUp class={"text-green-500"} />
          ) : (
            <FaSolidArrowDown class={"text-red-500"} />
          )}
          <span>
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(Number(row.original.amount))}
          </span>
        </div>
      );
    },
  },
  {
    id: "movementType",
    header: "Tipo",
    cell: ({ row }) => row.original.movementType?.name,
  },
  {
    id: "createdAt",
    header: "Fecha",
    cell: ({ row }) => format(fromUnixTime(row.original.createdAt), "PPp"),
  },
];
