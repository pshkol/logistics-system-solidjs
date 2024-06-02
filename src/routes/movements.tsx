import AddMovementDialog from "~/components/movement/index/add-movement-dialog";
import { createResource, createSignal, Show } from "solid-js";
import { getMovements } from "~/actions/movement/get-movements";
import { DataTable } from "~/components/ui/data-table";
import { movementsTableColumns } from "~/components/movement/index/movements-table-columns";
import { PaginationState } from "@tanstack/solid-table";

export default function Movements() {
  const [pagination, setPagination] = createSignal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [movements, { refetch }] = createResource(pagination, getMovements);

  return (
    <main class={"container p-5"}>
      <aside class={"flex items-center justify-between"}>
        <h1 class={"text-lg font-semibold"}>Ingresos / Gastos</h1>
        <AddMovementDialog refreshMovements={refetch} />
      </aside>
      <section class={"mt-5"}>
        <Show when={movements.state === "ready"} fallback={"Cargando..."}>
          <DataTable
            columns={movementsTableColumns}
            pagination={pagination()}
            pageCount={movements()?.pageCount}
            onPaginationChange={setPagination}
            data={movements()?.data ?? []}
          />
        </Show>
      </section>
    </main>
  );
}
