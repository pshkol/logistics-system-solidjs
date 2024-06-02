import { useParams } from "@solidjs/router";
import { coerce, minValue, number, parse } from "valibot";
import { createResource, Show } from "solid-js";
import { getDriver } from "~/actions/driver/get-driver";

export default function DriverDetails() {
  const params = useParams();
  const driverId = parse(coerce(number([minValue(1)]), Number), params.id);

  const [driver] = createResource({ driverId: driverId }, getDriver);

  return (
    <main class={"container flex flex-col gap-2 pt-5"}>
      <Show when={driver()} fallback={<div>Cargando...</div>}>
        <h1
          class={"text-2xl font-semibold"}
        >{`${driver()?.name} ${driver()?.lastName}`}</h1>
        <p
          class={"text-sm"}
        >{`Creado el ${new Date(driver()?.createdAt!).toLocaleString()}`}</p>
      </Show>
    </main>
  );
}
