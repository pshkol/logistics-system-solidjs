import { createEffect, createResource, createSignal, Show } from "solid-js";
import { getClientDebts } from "~/actions/client/get-client-debts";
import { DataTable } from "~/components/ui/data-table";
import { clientDebtsTableColumns } from "~/components/client/driver-details/client-debts-table-columns";

type ClientDebtsProps = {
  clientId: number;
};

export default function ClientDebts(props: ClientDebtsProps) {
  const [clientDebts] = createResource(
    { clientId: props.clientId },
    getClientDebts,
  );

  const [isReady, setIsReady] = createSignal(false);

  createEffect(() => {
    setIsReady(!clientDebts.loading);
  });

  return (
    <Show when={isReady} fallback={<div>Cargando...</div>}>
      <DataTable columns={clientDebtsTableColumns} data={clientDebts() ?? []} />
    </Show>
  );
}
