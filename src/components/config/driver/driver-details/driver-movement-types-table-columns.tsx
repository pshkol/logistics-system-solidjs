import { ColumnDef } from "@tanstack/solid-table";
import { GetMovementTypesOutput } from "~/actions/movement-type/get-movement-types";
import { FaSolidArrowDown, FaSolidArrowUp } from "solid-icons/fa";
import AddMovementPaymentDialog from "~/components/config/driver/driver-details/add-movement-payment-dialog";

export const driverMovementTypesTableColumns = (
  driverId: number,
): ColumnDef<GetMovementTypesOutput["data"][number]>[] => {
  return [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      id: "name",
      header: "Nombre",
      cell: ({ row }) => {
        return (
          <div class={"flex items-center gap-1"}>
            {row.original.type === "IN" ? (
              <FaSolidArrowUp class={"text-green-500"} />
            ) : (
              <FaSolidArrowDown class={"text-red-500"} />
            )}
            <span>{row.original.name}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div class={"flex justify-end"}>
          <AddMovementPaymentDialog
            movementTypeId={row.original.id}
            driverId={driverId}
          />
        </div>
      ),
    },
  ];
};
