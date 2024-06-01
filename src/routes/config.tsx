import { Button } from "~/components/ui/button";
import CreateMovementTypeDialog from "~/components/config/movements/create-movement-type-dialog";
import { createResource, createSignal, Show } from "solid-js";
import { DataTable } from "~/components/ui/data-table";
import { movementTypeTable } from "~/components/config/movements/movement-types-table-columns";
import { PaginationState } from "@tanstack/solid-table";
import { getMovementTypes } from "~/actions/movement-type/get-movement-types";

export default function Config() {
  const [pagination, setPagination] = createSignal<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });

  const [data, { refetch }] = createResource(pagination, getMovementTypes);

  return (
    <main class={"container pt-5 h-[calc(100%-50px)] flex gap-2"}>
      <aside
        class={
          "border-r-[1px] flex max-w-[16rem] h-full flex-col flex-1 border-r-gray-200"
        }
      >
        <ul>
          <li>
            <Button variant={"ghost"}>Categorias de ingresos / gastos</Button>
          </li>
        </ul>
      </aside>
      <section class={"flex flex-col flex-1 w-full"}>
        <div class={"flex justify-end mb-5"}>
          <CreateMovementTypeDialog refreshMovementTypes={refetch} />
        </div>
        <Show when={data.state === "ready"} fallback={<p>Cargando...</p>}>
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
