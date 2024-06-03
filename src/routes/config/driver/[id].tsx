import { useParams } from "@solidjs/router";
import { coerce, minValue, number, parse } from "valibot";
import { createResource, Show } from "solid-js";
import { getDriver } from "~/actions/driver/get-driver";
import { getMovementTypes } from "~/actions/movement-type/get-movement-types";
import { DataTable } from "~/components/ui/data-table";
import { driverMovementTypesTableColumns } from "~/components/config/driver/driver-details/driver-movement-types-table-columns";

export default function DriverDetails() {
  const params = useParams();
  const driverId = parse(coerce(number([minValue(1)]), Number), params.id);

  const [driver] = createResource({ driverId: driverId }, getDriver);
  const [movementTypes] = createResource(
    { pageSize: 0, pageIndex: 0, isDriverRequired: true },
    getMovementTypes,
  );

  return (
    <main class={"container flex flex-col gap-2 pt-5"}>
      <Show when={driver()} fallback={<div>Cargando...</div>}>
        <section>
          <h1
            class={"text-2xl font-semibold"}
          >{`${driver()?.name} ${driver()?.lastName}`}</h1>
          <p
            class={"text-sm"}
          >{`Creado el ${new Date(driver()?.createdAt!).toLocaleString()}`}</p>
        </section>
        <section class={"mt-5"}>
          <h2 class={"mb-2 text-xl font-semibold"}>Tipos de movimientos</h2>
          <DataTable
            columns={driverMovementTypesTableColumns(driverId)}
            data={movementTypes()?.data ?? []}
          />
        </section>
      </Show>
    </main>
  );
}
