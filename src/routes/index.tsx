import { db } from "~/db/db";
import { createResource } from "solid-js";

const getRealMoney = async () => {
  "use server";
  const realMoney = await db.query.movementSchema.findMany({
    with: {
      clientDebt: true,
    },
  });
  return realMoney.reduce((acc, movement) => {
    if (movement.clientDebt) {
      return acc;
    }
    return acc + Number(movement.amount);
  }, 0);
};

const getDriversDebt = async () => {
  "use server";
  const drivers = await db.query.debtToDriverSchema.findMany();
  return drivers.reduce((acc, driver) => acc + Number(driver.amount), 0);
};

const getClientsDebt = async () => {
  "use server";
  const clients = await db.query.clientDebtSchema.findMany();
  return clients.reduce((acc, client) => acc + Number(client.amount), 0);
};

export default function Home() {
  const [driversDebt] = createResource(getDriversDebt);
  const [clientsDebt] = createResource(getClientsDebt);
  const [realMoney] = createResource(getRealMoney);

  return (
    <main class={"container"}>
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
