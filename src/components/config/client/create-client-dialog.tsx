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
import ClientForm from "~/components/config/client/client-form";
import { ClientSchema } from "~/validations/config/client";
import { db } from "~/db/db";
import { clientSchema } from "~/db/schema";
import { toast } from "solid-toast";
import { createSignal } from "solid-js";

const createNewClient = async (values: ClientSchema) => {
  "use server";
  await db.insert(clientSchema).values({
    name: values.name,
  });
};

export function CreateClientDialog() {
  const [open, setOpen] = createSignal(false);

  const handleCreateNewClient = async (values: ClientSchema) => {
    await toast
      .promise(createNewClient(values), {
        loading: "Creando cliente...",
        success: "Cliente creado",
        error: "Error al crear cliente",
      })
      .then(() => {
        setOpen(false);
      });
  };

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button {...props}>Crear cliente</Button>
        )}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear cliente</DialogTitle>
          <DialogDescription>
            Complete los campos para crear un nuevo cliente.
          </DialogDescription>
          <ClientForm onValidSubmit={handleCreateNewClient} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
