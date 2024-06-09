import CreateMovementTypeDialog from "~/components/config/movement-type/create-movement-type-dialog";
import { createResource, createSignal, Show } from "solid-js";
import { DataTable } from "~/components/ui/data-table";
import { movementTypeTable } from "~/components/config/movement-type/movement-types-table-columns";
import { PaginationState } from "@tanstack/solid-table";
import { getMovementTypes } from "~/actions/movement-type/get-movement-types";

export default function MovementType() {
  const [pagination, setPagination] = createSignal<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });

  const [data, { refetch }] = createResource(pagination, getMovementTypes);

  return (
    <main class={"container flex flex-col gap-2 pt-5"}>
      <aside class={"flex items-center justify-between"}>
        <h1 class={"text-lg font-semibold"}>Tipos de ingresos / gastos</h1>
        <CreateMovementTypeDialog refreshMovementTypes={refetch} />
      </aside>
      <section class={"mt-5"}>
        <Show when={data()} fallback={<p>Cargando...</p>}>
          <DataTable
            pagination={pagination()}
            onPaginationChange={setPagination}
            columns={movementTypeTable}
            data={data()?.data ?? []}
            pageCount={data()?.pageCount}
          />
        </Show>
      </section>
    </main>
  );
}
