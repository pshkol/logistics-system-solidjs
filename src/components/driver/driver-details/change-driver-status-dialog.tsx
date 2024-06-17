import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { db } from "~/db/db";
import { driverSchema } from "~/db/schema";
import { eq } from "drizzle-orm";
import { createSignal } from "solid-js";
import { toast } from "solid-toast";

const changeDriverStatus = async (
  driverId: number,
  newActiveStatus: boolean,
) => {
  "use server";

  const debtToProvider = await db.query.debtToDriverSchema.findMany({
    where: (debt, { eq }) => eq(debt.driverId, driverId),
    with: {
      paymentsToDriver: true,
    },
  });

  const totalDebtToDriver = debtToProvider.reduce((acc, debt) => {
    return (
      acc +
      debt.amount -
      debt.paymentsToDriver.reduce((acc, payment) => acc + payment.amount, 0)
    );
  }, 0);

  if (totalDebtToDriver > 0) {
    throw new Error("El conductor tiene deudas pendientes");
  }

  await db
    .update(driverSchema)
    .set({
      active: newActiveStatus,
    })
    .where(eq(driverSchema.id, driverId));
};

type ChangeDriverStatusDialogProps = {
  driverStatus: boolean;
  driverId: number;
  onChangeStatus: () => void;
};

const ChangeDriverStatusDialog = (props: ChangeDriverStatusDialogProps) => {
  const [isLoading, setIsLoading] = createSignal(false);
  const [open, setOpen] = createSignal(false);

  const handleChangeDriverStatus = async () => {
    setIsLoading(true);
    await toast
      .promise(
        changeDriverStatus(props.driverId, !props.driverStatus).then(() => {
          setIsLoading(false);
        }),
        {
          loading: "Cambiando estado del conductor...",
          success: "Estado del conductor cambiado",
          error: "Error al cambiar estado del conductor",
        },
      )
      .finally(() => {
        props.onChangeStatus();
        setOpen(false);
        setIsLoading(false);
      });
  };

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger
        as={Button}
        variant={props.driverStatus ? "destructive" : "default"}
      >
        {props.driverStatus ? "Anular" : "Activar"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anular conductor</DialogTitle>
          <DialogDescription>
            {props.driverStatus
              ? "¿Está seguro de anular este conductor?"
              : "¿Está seguro de activar este conductor?"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={props.driverStatus ? "destructive" : "default"}
            disabled={isLoading()}
            onClick={handleChangeDriverStatus}
          >
            {props.driverStatus ? "Anular" : "Activar"}
          </Button>
          <DialogClose>
            <Button variant={"secondary"} disabled={isLoading()}>
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeDriverStatusDialog;
