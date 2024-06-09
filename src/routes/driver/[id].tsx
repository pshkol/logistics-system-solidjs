import { useParams } from "@solidjs/router";
import { parse, pipe, unknown, transform } from "valibot";
import { createResource, Show } from "solid-js";
import { getDriver } from "~/actions/driver/get-driver";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import DriverMovementTypePayments from "~/components/driver/driver-details/driver-movement-type-payments";
import DebtsToDriver from "~/components/driver/driver-details/debts-to-driver";
import { format, fromUnixTime } from "date-fns";

enum TabsEnum {
  MOVEMENT_TYPES = "MOVEMENT_TYPES",
  DEBTS_TO_DRIVER = "DEBTS_TO_DRIVER",
}

export default function DriverDetails() {
  const params = useParams();
  const driverId = parse(pipe(unknown(), transform(Number)), params.id);

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
          >{`Creado el ${format(fromUnixTime(driver()?.createdAt!), "PPp")}`}</p>
        </section>
        <section class={"mt-5"}>
          <Tabs defaultValue={TabsEnum.MOVEMENT_TYPES}>
            <TabsList>
              <TabsTrigger value={TabsEnum.MOVEMENT_TYPES}>
                Tipos de movimientos
              </TabsTrigger>
              <TabsTrigger value={TabsEnum.DEBTS_TO_DRIVER}>
                Deudas al conductor
              </TabsTrigger>
            </TabsList>
            <TabsContent value={TabsEnum.MOVEMENT_TYPES}>
              <DriverMovementTypePayments driverId={driverId} />
            </TabsContent>
            <TabsContent value={TabsEnum.DEBTS_TO_DRIVER}>
              <DebtsToDriver driverId={driverId} />
            </TabsContent>
          </Tabs>
        </section>
      </Show>
    </main>
  );
}
