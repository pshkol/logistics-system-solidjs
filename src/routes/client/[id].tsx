import { useParams } from "@solidjs/router";
import { parse, pipe, unknown, transform } from "valibot";
import { createResource, Show } from "solid-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { format, fromUnixTime } from "date-fns";
import { getClient } from "~/actions/client/get-client";
import ClientDebts from "~/components/client/driver-details/client-debts";

enum TabsEnum {
  DEBTS = "DEBTS",
}

export default function DriverDetails() {
  const params = useParams();
  const clientId = parse(pipe(unknown(), transform(Number)), params.id);

  const [client] = createResource({ clientId }, getClient);

  return (
    <main class={"container flex flex-col gap-2 pt-5"}>
      <Show when={client()} fallback={<div>Cargando...</div>}>
        <section>
          <h1 class={"text-2xl font-semibold"}>{client()?.name}</h1>
          <p
            class={"text-sm"}
          >{`Creado el ${format(fromUnixTime(client()?.createdAt!), "PPp")}`}</p>
        </section>
        <section class={"mt-5"}>
          <Tabs defaultValue={TabsEnum.DEBTS}>
            <TabsList>
              <TabsTrigger value={TabsEnum.DEBTS}>Deudas</TabsTrigger>
            </TabsList>
            <TabsContent value={TabsEnum.DEBTS}>
              <ClientDebts clientId={clientId} />
            </TabsContent>
          </Tabs>
        </section>
      </Show>
    </main>
  );
}
