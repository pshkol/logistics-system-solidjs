import { createSignal } from "solid-js";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { getClientsDebt } from "~/actions/client/get-clients-debt";
import { getDriversDebt } from "~/actions/driver/get-drivers-debt";
import { getRealMoney } from "~/actions/common/get-real-money";
import { formatISO } from "date-fns";
import { type RouteSectionProps } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";

export default function Home(props: RouteSectionProps) {
  // const [startDate, setStartDate] = createSignal<string>(
  //   formatISO(new Date(), { representation: "date" }),
  // );
  const [endDate, setEndDate] = createSignal<string>(
    formatISO(new Date(), { representation: "date" }),
  );

  const driversDebtQuery = createQuery(() => ({
    queryKey: ["driversDebt", { endDate: endDate() }],
    queryFn: () => getDriversDebt({ endDate: endDate() }),
  }));

  const clientsDebtQuery = createQuery(() => ({
    queryKey: ["clientsDebt", { endDate: endDate() }],
    queryFn: () => getClientsDebt({ endDate: endDate() }),
  }));

  const realMoneyQuery = createQuery(() => ({
    queryKey: ["realMoney", { endDate: endDate() }],
    queryFn: () => getRealMoney({ endDate: endDate() }),
  }));

  return (
    <main class={"container"}>
      <section class={"mt-3 flex items-center justify-end gap-3"}>
        {/*<TextFieldRoot onChange={setStartDate} value={startDate()}>*/}
        {/*  <TextField type={"date"} />*/}
        {/*</TextFieldRoot>*/}
        {/*-*/}
        <TextFieldRoot onChange={setEndDate} value={endDate()}>
          <TextField type={"date"} />
        </TextFieldRoot>
      </section>
      <section class={"mt-5 grid grid-cols-3 gap-2"}>
        <div class={"rounded-lg bg-neutral-50 p-2 shadow-md"}>
          <p class={"text-sm font-semibold"}>Plata real</p>
          <span>
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(realMoneyQuery.data ?? 0)}
          </span>
        </div>
        <div class={"rounded-lg bg-neutral-50 p-2 shadow-md"}>
          <p class={"text-sm font-semibold"}>Deuda de clientes</p>
          <span>
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(clientsDebtQuery.data ?? 0)}
          </span>
        </div>
        <div class={"rounded-lg bg-neutral-50 p-2 shadow-md"}>
          <p class={"text-sm font-semibold"}>Deuda a conductores</p>
          <span>
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(driversDebtQuery.data ?? 0)}
          </span>
        </div>
      </section>
    </main>
  );
}
