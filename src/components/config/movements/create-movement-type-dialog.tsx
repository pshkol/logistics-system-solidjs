import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { DialogTriggerProps } from "@kobalte/core/dialog";
import { Button } from "~/components/ui/button";
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import {
  createForm,
  SubmitHandler,
  valiForm,
  setValue,
} from "@modular-forms/solid";
import { MovementTypeSchema } from "~/validations/config/movement-type-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { db } from "~/db/db";
import { movementDirectionTypeEnum, movementTypeSchema } from "~/db/schema";
import { createSignal } from "solid-js";
import { toast } from "solid-toast";
import { errorMessageClass } from "~/utils/error-message-class";

const createMovementType = async (values: MovementTypeSchema) => {
  "use server";
  await db.insert(movementTypeSchema).values({
    name: values.name,
    type: values.type,
  });
};

type CreateMovementCategoryDialogProps = {
  refreshMovementTypes: () => void;
};

export default function CreateMovementTypeDialog({
  refreshMovementTypes,
}: CreateMovementCategoryDialogProps) {
  const [openDialog, setOpenDialog] = createSignal(false);
  const [isPending, setIsPending] = createSignal(false);

  const [form, { Form, Field }] = createForm<MovementTypeSchema>({
    validate: valiForm(MovementTypeSchema),
  });

  const handleSubmit: SubmitHandler<MovementTypeSchema> = async (values) => {
    setIsPending(true);
    await toast.promise(createMovementType(values), {
      loading: "Creando categoría...",
      success: "Categoría creada correctamente",
      error: "Error al crear la categoría",
    });
    setOpenDialog(false);
    refreshMovementTypes();
    setIsPending(false);
  };

  return (
    <Dialog open={openDialog()} onOpenChange={(value) => setOpenDialog(value)}>
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button {...props}>Crear categoría</Button>
        )}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear categoría</DialogTitle>
          <DialogDescription>
            Formulario para crear una nueva categoría de ingresos / gastos
          </DialogDescription>
          <Form onSubmit={handleSubmit} class={"flex flex-col gap-4 py-4"}>
            <Field name={"name"}>
              {(store, props) => (
                <TextFieldRoot
                  validationState={store.error ? "invalid" : "valid"}
                >
                  <TextFieldLabel>Nombre</TextFieldLabel>
                  <TextField {...props} />
                  <TextFieldErrorMessage>{store.error}</TextFieldErrorMessage>
                </TextFieldRoot>
              )}
            </Field>
            <Field name={"type"}>
              {(store) => (
                <Select
                  value={store.value}
                  onChange={(
                    value: (typeof movementDirectionTypeEnum.enumValues)[number],
                  ) => {
                    setValue(form, "type", value);
                  }}
                  options={movementDirectionTypeEnum.enumValues}
                  placeholder="Selecciona un tipo"
                  itemComponent={(props) => (
                    <SelectItem item={props.item}>
                      {(props.item.rawValue as unknown as string) === "IN"
                        ? "Ingreso"
                        : "Gasto"}
                    </SelectItem>
                  )}
                >
                  <SelectTrigger aria-label="Type" class="w-full">
                    <SelectValue<string>>
                      {(state) =>
                        state.selectedOption() === "IN" ? "Ingreso" : "Gasto"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent />
                  <p class={errorMessageClass}>{store.error}</p>
                </Select>
              )}
            </Field>
            <Button disabled={isPending()} type={"submit"}>
              Crear
            </Button>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
