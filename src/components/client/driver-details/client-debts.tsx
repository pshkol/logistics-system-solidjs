import { createEffect, createResource, createSignal, Show } from "solid-js";
import { getClientDebts } from "~/actions/client/get-client-debts";
import { DataTable } from "~/components/ui/data-table";
import { getClientDebtsTableColumns } from "~/components/client/driver-details/client-debts-table-columns";

type ClientDebtsProps = {
  clientId: number;
};

export default function ClientDebts(props: ClientDebtsProps) {
  const [clientDebts, { refetch }] = createResource(
    { clientId: props.clientId },
    getClientDebts,
  );
  const [isReady, setIsReady] = createSignal(false);
  const tableColumns = getClientDebtsTableColumns({ onPaymentAdded: refetch });

  createEffect(() => {
    setIsReady(!clientDebts.loading);
  });

  return (
    <Show when={isReady()} fallback={<div>Cargando...</div>}>
      <DataTable columns={tableColumns} data={clientDebts() ?? []} />
    </Show>
  );
}
