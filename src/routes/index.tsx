import { createSignal } from "solid-js";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import {
  getClientsDebt,
  GetClientsDebtInput,
} from "~/actions/client/get-clients-debt";
import {
  getDriversDebt,
  GetDriversDebtInput,
} from "~/actions/driver/get-drivers-debt";
import {
  getRealMoney,
  GetRealMoneyInput,
} from "~/actions/common/get-real-money";
import { formatISO } from "date-fns";
import { cache, createAsync } from "@solidjs/router";

const getDriversDebtCached = cache(
  (params: GetDriversDebtInput) => getDriversDebt(params),
  "driversDebt",
);

const getClientsDebtCached = cache(
  (params: GetClientsDebtInput) => getClientsDebt(params),
  "clientsDebt",
);
const getRealMoneyCached = cache(
  (params: GetRealMoneyInput) => getRealMoney(params),
  "realMoney",
);

export default function Home() {
  // const [startDate, setStartDate] = createSignal<string>(
  //   formatISO(new Date(), { representation: "date" }),
  // );
  const [endDate, setEndDate] = createSignal<string>(
    formatISO(new Date(), { representation: "date" }),
  );

  const driversDebt = createAsync(() =>
    getDriversDebtCached({
      endDate: endDate(),
    }),
  );
  const clientsDebt = createAsync(() =>
    getClientsDebtCached({ endDate: endDate() }),
  );
  const realMoney = createAsync(() =>
    getRealMoneyCached({ endDate: endDate() }),
  );

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
            }).format(realMoney() ?? 0)}
          </span>
        </div>
        <div class={"rounded-lg bg-neutral-50 p-2 shadow-md"}>
          <p class={"text-sm font-semibold"}>Deuda de clientes</p>
          <span>
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(clientsDebt() ?? 0)}
          </span>
        </div>
        <div class={"rounded-lg bg-neutral-50 p-2 shadow-md"}>
          <p class={"text-sm font-semibold"}>Deuda a conductores</p>
          <span>
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(driversDebt() ?? 0)}
          </span>
        </div>
      </section>
    </main>
  );
}
