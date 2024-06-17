import { createSignal, createResource } from "solid-js";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { getClientsDebt } from "~/actions/client/get-clients-debt";
import { getDriversDebt } from "~/actions/driver/get-drivers-debt";
import { getRealMoney } from "~/actions/common/get-real-money";
import { formatISO } from "date-fns";

export default function Home() {
  // const [startDate, setStartDate] = createSignal<string>(
  //   formatISO(new Date(), { representation: "date" }),
  // );
  const [endDate, setEndDate] = createSignal<string>(
    formatISO(new Date(), { representation: "date" }),
  );

  const [driversDebt, { refetch: refetchDriversDebt }] = createResource(() =>
    getDriversDebt({ endDate: endDate() }),
  );

  const [clientsDebt, { refetch: refetchClientsDebt }] = createResource(() =>
    getClientsDebt({
      endDate: endDate(),
    }),
  );

  const [realMoney, { refetch: refetchRealMoney }] = createResource(() =>
    getRealMoney({
      endDate: endDate(),
    }),
  );

  return (
    <main class={"container"}>
      <section class={"mt-3 flex items-center justify-end gap-3"}>
        {/*<TextFieldRoot onChange={setStartDate} value={startDate()}>*/}
        {/*  <TextField type={"date"} />*/}
        {/*</TextFieldRoot>*/}
        {/*-*/}
        <TextFieldRoot
          onChange={(vale) => {
            setEndDate(vale);
            refetchDriversDebt();
            refetchClientsDebt();
            refetchRealMoney();
          }}
          value={endDate()}
        >
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
