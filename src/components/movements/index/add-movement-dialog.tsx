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
import { createSignal, createResource } from "solid-js";
import { createForm, valiForm, setValue } from "@modular-forms/solid";
import { MovementSchema } from "~/validations/movement/movement-schema";
import { Textarea } from "~/components/ui/textarea";
import {
  ComboboxContent,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemLabel,
  Combobox,
  ComboboxTrigger,
} from "~/components/ui/combobox";
import { getMovementTypes } from "~/actions/movement-type/get-movement-types";
import { PaginationState } from "@tanstack/solid-table";
import { errorMessageClass } from "~/utils/error-message-class";
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldRoot,
} from "~/components/ui/textfield";
import { db } from "~/db/db";
import { movementSchema } from "~/db/schema";
import { toast } from "solid-toast";

const createMovement = async (values: MovementSchema) => {
  "use server";
  await db.insert(movementSchema).values({
    amount: values.amount.toString(),
    description: values.description,
    movementTypeId: values.movementTypeId,
  });
};

export default function AddMovementDialog() {
  const [openDialog, setOpenDialog] = createSignal(false);
  const [pagination, _] = createSignal<PaginationState>({
    pageSize: 0,
    pageIndex: 0,
  });
  const [isPending, setIsPending] = createSignal(false);

  const [movementTypes] = createResource(pagination, getMovementTypes);

  const [form, { Form, Field }] = createForm<MovementSchema>({
    validate: valiForm(MovementSchema),
  });

  const handleSubmit = async (values: MovementSchema) => {
    setIsPending(true);
    await toast.promise(createMovement(values), {
      loading: "Creando movimiento...",
      error: "Error al crear el movimiento",
      success: "Movimiento creado correctamente",
    });
    setIsPending(false);
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog()} onOpenChange={setOpenDialog}>
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button {...props}>Añadir movimiento</Button>
        )}
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir movimiento</DialogTitle>
          <DialogDescription>
            Formulario para añadir un nuevo movimiento
          </DialogDescription>
        </DialogHeader>
        <Form onSubmit={handleSubmit} class="grid gap-4 py-4">
          <Field name={"movementTypeId"} type={"number"}>
            {(store) => (
              <Combobox
                options={movementTypes()?.data.map((item) => item.name) ?? []}
                placeholder="Tipo de movimiento"
                onChange={(value) => {
                  setValue(
                    form,
                    "movementTypeId",
                    movementTypes()?.data.find((item) => item.name === value)
                      ?.id ?? 0,
                  );
                }}
                itemComponent={(props) => (
                  <ComboboxItem item={props.item}>
                    <ComboboxItemLabel>{props.item.rawValue}</ComboboxItemLabel>
                    <ComboboxItemIndicator />
                  </ComboboxItem>
                )}
              >
                <ComboboxControl aria-label="Movement type">
                  <ComboboxInput />
                  <ComboboxTrigger />
                </ComboboxControl>
                <ComboboxContent />
                {store.error && <p class={errorMessageClass}>{store.error}</p>}
              </Combobox>
            )}
          </Field>
          <Field name={"amount"} type={"number"}>
            {(store) => (
              <TextFieldRoot
                onChange={(value) => setValue(form, "amount", parseInt(value))}
                validationState={store.error ? "invalid" : "valid"}
              >
                <TextField type={"tel"} placeholder={"Monto"} />
                <TextFieldErrorMessage>{store.error}</TextFieldErrorMessage>
              </TextFieldRoot>
            )}
          </Field>
          <Field name={"description"} type={"string"}>
            {(store) => (
              <div>
                <Textarea
                  {...store}
                  placeholder={"Descripción"}
                  onChange={(event) =>
                    setValue(form, "description", event.target.value)
                  }
                />
                {store.error && <p class={errorMessageClass}>{store.error}</p>}
              </div>
            )}
          </Field>
          <Button disabled={isPending()} type={"submit"}>
            Añadir
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
