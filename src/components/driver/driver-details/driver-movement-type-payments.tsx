import { createResource, Show } from "solid-js";
import { DataTable } from "~/components/ui/data-table";
import { driverMovementTypesTableColumns } from "~/components/driver/driver-details/driver-movement-types-table-columns";
import { getMovementTypes } from "~/actions/movement-type/get-movement-types";

type DriverMovementTypePaymentsProps = {
  driverId: number;
};

export default function DriverMovementTypePayments(
  props: DriverMovementTypePaymentsProps,
) {
  const [movementTypes, { refetch }] = createResource(
    { pageSize: 0, pageIndex: 0, isDriverRequired: true },
    getMovementTypes,
  );

  return (
    <Show when={movementTypes()} fallback={<div>Cargando...</div>}>
      <DataTable
        columns={driverMovementTypesTableColumns({
          driverId: props.driverId,
          onPaymentAdded: refetch,
        })}
        data={movementTypes()?.data ?? []}
      />
    </Show>
  );
}
