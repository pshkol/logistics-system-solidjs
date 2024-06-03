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
import { createSignal, createResource, Show } from "solid-js";
import {
  createForm,
  valiForm,
  setValue,
  getValue,
  setValues,
} from "@modular-forms/solid";
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
import {
  clientDebtSchema,
  debtToDriverSchema,
  driverMovementPaymentSchema,
  movementSchema,
} from "~/db/schema";
import { toast } from "solid-toast";
import { getDrivers } from "~/actions/driver/get-drivers";
import { getClients } from "~/actions/client/get-clients";
import { getDriverCurrentPayment } from "~/actions/driver/get-driver-current-payment";

const createMovement = async (values: MovementSchema) => {
  "use server";
  const movementType = await db.query.movementTypeSchema.findFirst({
    where: (movementType, { eq }) => eq(movementType.id, values.movementTypeId),
  });

  if (!movementType) {
    throw new Error("Tipo de movimiento no encontrado");
  }

  await db.transaction(async (tx) => {
    let clientDebtId;

    if (movementType.doCreateClientDebt) {
      await tx
        .insert(clientDebtSchema)
        .values({
          amount: values.amount.toString(),
          clientId: values.clientId!,
        })
        .returning()
        .then((res) => (clientDebtId = res[0].id));
    }

    const movement = await tx
      .insert(movementSchema)
      .values({
        amount: values.amount.toString(),
        description: values.description,
        movementTypeId: values.movementTypeId,
        driverId: values.driverId,
        customerDebtId: clientDebtId,
      })
      .returning()
      .then((res) => res[0]);

    if (values.driverMovementPaymentId) {
      await tx.insert(debtToDriverSchema).values({
        driverId: values.driverId!,
        amount: values.driverMovementPaymentAmount!.toString(),
        driverMovementPaymentId: values.driverMovementPaymentId!,
        movementId: movement.id,
      });
    }
  });
};

type AddMovementDialogProps = {
  refreshMovements: () => void;
};

export default function AddMovementDialog(props: AddMovementDialogProps) {
  const [openDialog, setOpenDialog] = createSignal(false);
  const [pagination, _] = createSignal<PaginationState>({
    pageSize: 0,
    pageIndex: 0,
  });

  const [movementTypes] = createResource(pagination, getMovementTypes);
  const [drivers] = createResource(pagination, getDrivers);
  const [clients] = createResource(pagination, getClients);

  const [form, { Form, Field }] = createForm<MovementSchema>({
    validate: valiForm(MovementSchema),
  });

  const handleSubmit = async (values: MovementSchema) => {
    await toast.promise(createMovement(values), {
      loading: "Creando movimiento...",
      error: "Error al crear el movimiento",
      success: "Movimiento creado correctamente",
    });
    props.refreshMovements();
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
          <Field name={"isDriverRequired"} type={"boolean"}>
            {() => null}
          </Field>
          <Field name={"isClientRequired"} type={"boolean"}>
            {() => null}
          </Field>
          <Field name={"driverMovementPaymentId"} type={"number"}>
            {() => null}
          </Field>
          <Field name={"driverMovementPaymentAmount"} type={"number"}>
            {() => null}
          </Field>
          <Field name={"movementTypeId"} type={"number"}>
            {(store) => (
              <Combobox
                options={movementTypes()?.data.map((item) => item.name) ?? []}
                placeholder="Tipo de movimiento"
                onChange={(value) => {
                  const movementType = movementTypes()?.data.find(
                    (item) => item.name === value,
                  );

                  setValues(form, {
                    isDriverRequired: movementType?.isDriverRequired ?? false,
                    movementTypeId: movementType?.id ?? 0,
                    driverId: undefined,
                    isClientRequired: movementType?.isClientRequired ?? false,
                    clientId: undefined,
                    driverMovementPaymentId: undefined,
                    driverMovementPaymentAmount: undefined,
                  });
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
          <Show
            when={
              getValue(form, "isDriverRequired") &&
              getValue(form, "movementTypeId") !== 0
            }
          >
            <Field name={"driverId"} type={"number"}>
              {(store) => (
                <Combobox
                  options={
                    drivers()?.data.map(
                      (item) => `${item.name} ${item.lastName}`,
                    ) ?? []
                  }
                  placeholder="Conductor"
                  onChange={async (value) => {
                    const driverId =
                      drivers()?.data.find(
                        (item) => `${item.name} ${item.lastName}` === value,
                      )?.id ?? 0;

                    const driverCurrentPayment =
                      await getDriverCurrentPayment(driverId);

                    setValues(form, {
                      driverId: driverId,
                      driverMovementPaymentId: driverCurrentPayment?.id ?? 0,
                      driverMovementPaymentAmount: driverCurrentPayment?.amount
                        ? Number(driverCurrentPayment.amount)
                        : 0,
                    });
                  }}
                  itemComponent={(props) => (
                    <ComboboxItem item={props.item}>
                      <ComboboxItemLabel>
                        {props.item.rawValue}
                      </ComboboxItemLabel>
                      <ComboboxItemIndicator />
                    </ComboboxItem>
                  )}
                >
                  <ComboboxControl aria-label="Driver">
                    <ComboboxInput />
                    <ComboboxTrigger />
                  </ComboboxControl>
                  <ComboboxContent />
                  {store.error && (
                    <p class={errorMessageClass}>{store.error}</p>
                  )}
                </Combobox>
              )}
            </Field>
          </Show>
          <Show when={getValue(form, "driverMovementPaymentId")}>
            <p class={"rounded-lg bg-amber-200 p-2 text-sm text-amber-500"}>
              {`Pago al conductor: ${new Intl.NumberFormat("es-AR", {
                currency: "ARS",
                style: "currency",
              }).format(getValue(form, "driverMovementPaymentAmount") ?? 0)}`}
            </p>
          </Show>
          <Show
            when={
              getValue(form, "isClientRequired") &&
              getValue(form, "movementTypeId") !== 0
            }
          >
            <Field name={"clientId"} type={"number"}>
              {(store) => (
                <Combobox
                  options={clients()?.data.map((item) => item.name) ?? []}
                  placeholder="Cliente"
                  onChange={(value) => {
                    setValue(
                      form,
                      "clientId",
                      clients()?.data.find((item) => item.name === value)?.id ??
                        0,
                    );
                  }}
                  itemComponent={(props) => (
                    <ComboboxItem item={props.item}>
                      <ComboboxItemLabel>
                        {props.item.rawValue}
                      </ComboboxItemLabel>
                      <ComboboxItemIndicator />
                    </ComboboxItem>
                  )}
                >
                  <ComboboxControl aria-label="Client">
                    <ComboboxInput />
                    <ComboboxTrigger />
                  </ComboboxControl>
                  <ComboboxContent />
                  {store.error && (
                    <p class={errorMessageClass}>{store.error}</p>
                  )}
                </Combobox>
              )}
            </Field>
          </Show>
          <Field name={"amount"} type={"number"}>
            {(store) => (
              <TextFieldRoot
                onChange={(value) => setValue(form, "amount", Number(value))}
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
          <Button disabled={form.submitting || form.validating} type={"submit"}>
            Añadir
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
