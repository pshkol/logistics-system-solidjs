import { CreateClientDialog } from "~/components/client/index/create-client-dialog";
import { DataTable } from "~/components/ui/data-table";
import { createSignal, Show, createResource, createEffect } from "solid-js";
import { getClients } from "~/actions/client/get-clients";
import { PaginationState } from "@tanstack/solid-table";
import { clientsTableColumns } from "~/components/client/index/clients-table-columns";

export default function Index() {
  const [pagination, setPagination] = createSignal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [clients, { refetch }] = createResource(pagination, getClients);

  const [isReady, setIsReady] = createSignal(false);

  createEffect(() => {
    setIsReady(!clients.loading);
  });

  return (
    <main class={"container flex flex-col gap-2 pt-5"}>
      <aside class={"flex items-center justify-between"}>
        <h1 class={"text-lg font-semibold"}>Clientes</h1>
        <CreateClientDialog onClientCreated={refetch} />
      </aside>
      <section class={"mt-5"}>
        <Show when={isReady()} fallback={<p>Cargando...</p>}>
          <DataTable
            pagination={pagination()}
            onPaginationChange={setPagination}
            columns={clientsTableColumns}
            data={clients()?.data ?? []}
            pageCount={clients()?.pageCount}
          />
        </Show>
      </section>
    </main>
  );
}
