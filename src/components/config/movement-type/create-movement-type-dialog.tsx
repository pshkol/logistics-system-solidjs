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
  getValues,
  getValue,
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
import { MovementDirectionTypeEnum, movementTypeSchema } from "~/db/schema";
import { createEffect, createSignal } from "solid-js";
import { toast } from "solid-toast";
import { errorMessageClass } from "~/utils/error-message-class";
import {
  Switch,
  SwitchControl,
  SwitchLabel,
  SwitchThumb,
} from "~/components/ui/switch";

const createMovementType = async (values: MovementTypeSchema) => {
  "use server";

  await db.insert(movementTypeSchema).values({
    name: values.name,
    type: values.type,
    isDriverRequired: values.isDriverRequired,
    doCreateClientDebt: values.doCreateClientDebt,
    isClientRequired: values.isClientRequired,
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
    initialValues: {
      isClientRequired: false,
      doCreateClientDebt: false,
      isDriverRequired: false,
    },
  });

  createEffect(() => {
    const formValues = getValues(form);
    if (formValues.doCreateClientDebt) {
      setValue(form, "isClientRequired", true);
    }
  });

  const handleSubmit: SubmitHandler<MovementTypeSchema> = async (values) => {
    setIsPending(true);
    await toast.promise(createMovementType(values), {
      loading: "Creando...",
      success: "Tipo de ingreso / gasto creado correctamente",
      error: "Error al crear el tipo de ingreso / gasto",
    });
    setOpenDialog(false);
    refreshMovementTypes();
    setIsPending(false);
  };

  return (
    <Dialog open={openDialog()} onOpenChange={(value) => setOpenDialog(value)}>
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button {...props}>Crear tipo de ingreso / gasto</Button>
        )}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear tipo de ingreso / gasto</DialogTitle>
          <DialogDescription>
            Formulario para crear un tipo de ingreso / gasto
          </DialogDescription>
          <Form onSubmit={handleSubmit} class={"flex flex-col gap-4 py-4"}>
            <Field name={"name"} type={"string"}>
              {(store, props) => (
                <TextFieldRoot
                  validationState={store.error ? "invalid" : "valid"}
                >
                  <TextFieldLabel>Nombre</TextFieldLabel>
                  {/*@ts-expect-error - It's ok*/}
                  <TextField {...props} />
                  <TextFieldErrorMessage>{store.error}</TextFieldErrorMessage>
                </TextFieldRoot>
              )}
            </Field>
            <Field name={"type"} type={"string"}>
              {(store) => (
                <Select
                  value={store.value}
                  onChange={(
                    value: (typeof MovementDirectionTypeEnum)[number],
                  ) => {
                    setValue(form, "type", value);
                  }}
                  options={MovementDirectionTypeEnum as unknown as string[]}
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
            <Field name={"isDriverRequired"} type={"boolean"}>
              {() => (
                <Switch
                  onChange={(isChecked) =>
                    setValue(form, "isDriverRequired", isChecked)
                  }
                  class="flex items-center space-x-2"
                >
                  <SwitchControl>
                    <SwitchThumb />
                  </SwitchControl>
                  <SwitchLabel class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70">
                    El conductor es requerido?
                  </SwitchLabel>
                </Switch>
              )}
            </Field>
            <Field name={"doCreateClientDebt"} type={"boolean"}>
              {(store) => (
                <Switch
                  checked={store.value}
                  onChange={(isChecked) =>
                    setValue(form, "doCreateClientDebt", isChecked)
                  }
                  class="flex items-center space-x-2"
                >
                  <SwitchControl>
                    <SwitchThumb />
                  </SwitchControl>
                  <SwitchLabel class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70">
                    Crear deuda al cliente?
                  </SwitchLabel>
                </Switch>
              )}
            </Field>
            <Field name={"isClientRequired"} type={"boolean"}>
              {(store) => (
                <Switch
                  disabled={getValue(form, "doCreateClientDebt")}
                  checked={store.value}
                  onChange={(isChecked) =>
                    setValue(form, "isClientRequired", isChecked)
                  }
                  class="flex items-center space-x-2"
                >
                  <SwitchControl>
                    <SwitchThumb />
                  </SwitchControl>
                  <SwitchLabel class="text-sm font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70">
                    El cliente es requerido?
                  </SwitchLabel>
                </Switch>
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
