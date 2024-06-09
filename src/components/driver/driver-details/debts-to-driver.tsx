import { createEffect, createResource, createSignal, Show } from "solid-js";
import { getDebtsToDriver } from "~/actions/driver/get-debts-to-driver";
import { DataTable } from "~/components/ui/data-table";
import { getDebtsToDriverTableColumns } from "~/components/driver/driver-details/debts-to-driver-table-columns";

type DebtsToDriverProps = {
  driverId: number;
};

export default function DebtsToDriver(props: DebtsToDriverProps) {
  const [debtsToDriver, { refetch }] = createResource(
    props.driverId,
    getDebtsToDriver,
  );
  const tableColumns = getDebtsToDriverTableColumns({
    onPaymentAdded: refetch,
  });

  const [isReady, setIsReady] = createSignal(false);

  createEffect(() => {
    setIsReady(!debtsToDriver.loading);
  });

  return (
    <Show when={isReady()} fallback={<div>Cargando...</div>}>
      <DataTable columns={tableColumns} data={debtsToDriver() ?? []} />
    </Show>
  );
}
