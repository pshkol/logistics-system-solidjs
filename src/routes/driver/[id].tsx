import { useParams } from "@solidjs/router";
import { coerce, minValue, number, parse } from "valibot";
import { createResource, Show } from "solid-js";
import { getDriver } from "~/actions/driver/get-driver";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import DriverMovementTypePayments from "~/components/driver/driver-details/driver-movement-type-payments";

enum TabsEnum {
  MOVEMENT_TYPES = "MOVEMENT_TYPES",
}

export default function DriverDetails() {
  const params = useParams();
  const driverId = parse(coerce(number([minValue(1)]), Number), params.id);

  const [driver] = createResource({ driverId: driverId }, getDriver);

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
          <Tabs defaultValue={TabsEnum.MOVEMENT_TYPES}>
            <TabsList>
              <TabsTrigger value={TabsEnum.MOVEMENT_TYPES}>
                Tipos de movimientos
              </TabsTrigger>
            </TabsList>
            <TabsContent value={TabsEnum.MOVEMENT_TYPES}>
              <DriverMovementTypePayments driverId={driverId} />
            </TabsContent>
          </Tabs>
        </section>
      </Show>
    </main>
  );
}
