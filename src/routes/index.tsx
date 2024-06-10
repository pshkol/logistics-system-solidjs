import { db } from "~/db/db";
import { createResource } from "solid-js";

const getRealMoney = async () => {
  "use server";
  const [realMoney, paymentsToDrivers, clientPayments] = await Promise.all([
    db.query.movementSchema.findMany({
      with: {
        clientDebt: true,
        movementType: true,
      },
    }),
    db.query.paymentToDriverSchema.findMany(),
    db.query.clientPaymentSchema.findMany(),
  ]);

  const totalPaymentsToDrivers = paymentsToDrivers.reduce(
    (acc, payment) => acc + Number(payment.amount),
    0,
  );

  const totalClientPayments = clientPayments.reduce(
    (acc, payment) => acc + Number(payment.amount),
    0,
  );

  return (
    realMoney.reduce((acc, movement) => {
      if (movement.clientDebt) {
        return acc;
      }
      return movement.movementType?.type === "IN"
        ? acc + Number(movement.amount)
        : acc - Number(movement.amount);
    }, 0) -
    totalPaymentsToDrivers +
    totalClientPayments
  );
};

const getDriversDebt = async () => {
  "use server";
  const [drivers, paymentsToDrivers] = await Promise.all([
    db.query.debtToDriverSchema.findMany(),
    db.query.paymentToDriverSchema.findMany(),
  ]);

  const totalPaymentsToDrivers = paymentsToDrivers.reduce(
    (acc, payment) => acc + Number(payment.amount),
    0,
  );

  return (
    drivers.reduce((acc, driver) => acc + Number(driver.amount), 0) -
    totalPaymentsToDrivers
  );
};

const getClientsDebt = async () => {
  "use server";
  const clients = await db.query.clientDebtSchema.findMany({
    with: {
      payments: true,
    },
  });
  return clients.reduce(
    (acc, client) =>
      acc +
      Number(client.amount) -
      client.payments.reduce((acc, curr) => acc + curr.amount, 0),
    0,
  );
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
