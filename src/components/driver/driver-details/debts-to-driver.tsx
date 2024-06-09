import { For, Show } from "solid-js";
import { getDebtsToDriver } from "~/actions/driver/get-debts-to-driver";
import { cache, createAsync } from "@solidjs/router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { format, fromUnixTime } from "date-fns";
import AddDebtToProviderPaymentDialog from "~/components/driver/driver-details/add-debt-to-provider-payment-dialog";

type DebtsToDriverProps = {
  driverId: number;
};

const cacheGetDebtsToDriver = cache(
  (driverId: number) => getDebtsToDriver(driverId),
  "getDebtsToDriver",
);

export default function DebtsToDriver(props: DebtsToDriverProps) {
  const debtsToDriver = createAsync(() =>
    cacheGetDebtsToDriver(props.driverId),
  );

  return (
    <Show when={debtsToDriver()} fallback={<div>Cargando...</div>}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Deuda inicial</TableHead>
            <TableHead>Deuda actual</TableHead>
            <TableHead>Movimiento</TableHead>
            <TableHead>Fecha creación</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <For each={debtsToDriver() ?? []}>
            {(debt) => {
              const currentDebtToDriver =
                debt.amount -
                debt.paymentsToDriver.reduce(
                  (acc, payment) => acc + payment.amount,
                  0,
                );

              return (
                <TableRow>
                  <TableCell>{debt.id}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    }).format(Number(debt.amount))}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    }).format(currentDebtToDriver)}
                  </TableCell>
                  <TableCell>{debt.movementId}</TableCell>
                  <TableCell>
                    {format(fromUnixTime(debt.createdAt), "PPp")}
                  </TableCell>
                  <TableCell>
                    {currentDebtToDriver === 0 ? null : (
                      <AddDebtToProviderPaymentDialog
                        maxPaymentAmount={Number(debt.amount)}
                        driverId={debt.driverId}
                        debtToDriverId={debt.id}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            }}
          </For>
        </TableBody>
      </Table>
    </Show>
  );
}
