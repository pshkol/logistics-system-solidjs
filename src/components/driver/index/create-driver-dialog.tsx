import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { DialogTriggerProps } from "@kobalte/core/dialog";
import DriverForm from "~/components/driver/index/driver-form";
import { db } from "~/db/db";
import { driverSchema } from "~/db/schema";
import { DriverSchema } from "~/validations/config/driver-schema";
import { toast } from "solid-toast";
import { createSignal } from "solid-js";

const createDriver = async (values: DriverSchema) => {
  "use server";
  await db.insert(driverSchema).values({
    name: values.name,
    lastName: values.lastName,
  });
};

type CreateDriverDialogProps = {
  refreshDrivers: () => void;
};

export default function CreateDriverDialog(props: CreateDriverDialogProps) {
  const [open, setOpen] = createSignal(false);

  const handleCreateDriver = async (values: DriverSchema) => {
    await toast
      .promise(createDriver(values), {
        loading: "Creando conductor...",
        success: "Conductor creado",
        error: "Error al crear conductor",
      })
      .then(() => {
        props.refreshDrivers();
        setOpen(false);
      });
  };

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button {...props}>Agregar conductor</Button>
        )}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar conductor</DialogTitle>
          <DialogDescription>
            Complete los campos para agregar un nuevo conductor.
          </DialogDescription>
        </DialogHeader>
        <DriverForm onValidSubmit={handleCreateDriver} />
      </DialogContent>
    </Dialog>
  );
}
