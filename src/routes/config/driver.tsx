import CreateDriverDialog from "~/components/config/driver/create-driver-dialog";
import { DataTable } from "~/components/ui/data-table";
import { createResource, createSignal, Show } from "solid-js";
import { getDrivers } from "~/actions/driver/get-drivers";
import { PaginationState } from "@tanstack/solid-table";
import { driversTableColumns } from "~/components/config/driver/drivers-table-columns";

export default function Driver() {
  const [pagination, setPagination] = createSignal<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });
  const [drivers, { refetch }] = createResource(pagination, getDrivers);

  return (
    <main class={"container pt-5 flex-col flex gap-2"}>
      <aside class={"flex justify-between items-center"}>
        <h1 class={"text-lg font-semibold"}>Conductores</h1>
        <CreateDriverDialog refreshDrivers={refetch} />
      </aside>
      <section class={"mt-5"}>
        <Show when={drivers.state === "ready"}>
          <DataTable
            pagination={pagination()}
            onPaginationChange={setPagination}
            pageCount={drivers()?.pageCount}
            columns={driversTableColumns}
            data={drivers()?.data ?? []}
          />
        </Show>
      </section>
    </main>
  );
}
