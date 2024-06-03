import { ColumnDef } from "@tanstack/solid-table";
import { GetMovementTypesOutput } from "~/actions/movement-type/get-movement-types";
import { FaSolidArrowDown, FaSolidArrowUp } from "solid-icons/fa";
import AddMovementPaymentDialog from "~/components/config/driver/driver-details/add-movement-payment-dialog";

type DriverMovementTypesTableColumnsProps = {
  driverId: number;
  onPaymentAdded: () => void;
};

export const driverMovementTypesTableColumns = (
  props: DriverMovementTypesTableColumnsProps,
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
      id: "currentPayment",
      header: "Pago actual",
      cell: ({ row }) => {
        return new Intl.NumberFormat("es-AR", {
          currency: "ARS",
          style: "currency",
        }).format(
          (row.original.driverMovementPayments.sort((a, b) => b.id - a.id).at(0)
            ?.amount as unknown as number) ?? 0,
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div class={"flex justify-end"}>
          <AddMovementPaymentDialog
            movementTypeId={row.original.id}
            driverId={props.driverId}
            onPaymentAdded={props.onPaymentAdded}
          />
        </div>
      ),
    },
  ];
};
