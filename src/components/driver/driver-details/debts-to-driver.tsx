import { createResource, Show } from "solid-js";
import { DataTable } from "~/components/ui/data-table";
import { debtsToDriverTableColumns } from "~/components/driver/driver-details/debts-to-driver-table-columns";
import { getDebtsToDriver } from "~/actions/driver/get-debts-to-driver";

type DebtsToDriverProps = {
  driverId: number;
};

export default function DebtsToDriver(props: DebtsToDriverProps) {
  const [debtsToDriver] = createResource(props.driverId, getDebtsToDriver);

  return (
    <Show when={debtsToDriver()} fallback={<div>Cargando...</div>}>
      <DataTable
        columns={debtsToDriverTableColumns}
        data={debtsToDriver() ?? []}
      />
    </Show>
  );
}
