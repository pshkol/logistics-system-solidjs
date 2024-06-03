import CreateDriverDialog from "~/components/config/driver/index/create-driver-dialog";
import { DataTable } from "~/components/ui/data-table";
import { createResource, createSignal, Show } from "solid-js";
import { getDrivers } from "~/actions/driver/get-drivers";
import { PaginationState } from "@tanstack/solid-table";
import { driversTableColumns } from "~/components/config/driver/index/drivers-table-columns";

export default function Index() {
  const [pagination, setPagination] = createSignal<PaginationState>({
    pageSize: 10,
    pageIndex: 0,
  });
  const [drivers, { refetch }] = createResource(pagination, getDrivers);

  return (
    <main class={"container flex flex-col gap-2 pt-5"}>
      <aside class={"flex items-center justify-between"}>
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
