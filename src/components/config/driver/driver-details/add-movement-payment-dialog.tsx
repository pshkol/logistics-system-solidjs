import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { FaSolidPlus } from "solid-icons/fa";
import { DialogTriggerProps } from "@kobalte/core/dialog";
import AddDriverMovementCostForm from "~/components/config/driver/driver-details/add-driver-movement-cost-form";
import { DriverMovementPaymentSchema } from "~/validations/config/driver-movement-payment-schema";
import { db } from "~/db/db";
import { driverMovementPaymentSchema } from "~/db/schema";
import { toast } from "solid-toast";
import { createSignal } from "solid-js";

const createDriverMovementPayment = async (
  values: DriverMovementPaymentSchema,
) => {
  "use server";
  await db.insert(driverMovementPaymentSchema).values({
    driverId: values.driverId,
    movementTypeId: values.movementTypeId,
    amount: values.cost.toString(),
  });
};

type AddMovementPaymentDialogProps = {
  driverId: number;
  movementTypeId: number;
  onPaymentAdded: () => void;
};

export default function AddMovementPaymentDialog(
  props: AddMovementPaymentDialogProps,
) {
  const [open, setOpen] = createSignal(false);

  const handleValidSubmit = async (values: DriverMovementPaymentSchema) => {
    await toast
      .promise(createDriverMovementPayment(values), {
        loading: "Agregando costo...",
        success: "Costo agregado",
        error: "Error al agregar costo",
      })
      .then(() => {
        props.onPaymentAdded();
        setOpen(false);
      });
  };

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button
            {...props}
            title={"Agregar costo"}
            variant={"ghost"}
            class={"w-6"}
          >
            <FaSolidPlus size={"18"} />
          </Button>
        )}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar costo</DialogTitle>
          <DialogDescription>
            Complete los campos para agregar un nuevo costo.
          </DialogDescription>
        </DialogHeader>
        <AddDriverMovementCostForm
          onValidSubmit={handleValidSubmit}
          movementTypeId={props.movementTypeId}
          driverId={props.driverId}
        />
      </DialogContent>
    </Dialog>
  );
}
