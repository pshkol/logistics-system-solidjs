import { createForm, setValue, valiForm } from "@modular-forms/solid";
import { DriverMovementPaymentSchema } from "~/validations/config/driver-movement-payment-schema";
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import { Button } from "~/components/ui/button";

type AddDriverMovementCostFormProps = {
  onValidSubmit: (values: DriverMovementPaymentSchema) => Promise<void>;
  driverId: number;
  movementTypeId: number;
};

export default function AddDriverMovementCostForm(
  props: AddDriverMovementCostFormProps,
) {
  const [form, { Form, Field }] = createForm<DriverMovementPaymentSchema>({
    validate: valiForm(DriverMovementPaymentSchema),
    initialValues: {
      driverId: props.driverId,
      movementTypeId: props.movementTypeId,
      cost: 0,
    },
  });

  return (
    <Form onSubmit={props.onValidSubmit} class={"flex flex-col gap-2"}>
      <Field name={"driverId"} type={"number"}>
        {() => null}
      </Field>
      <Field name={"movementTypeId"} type={"number"}>
        {() => null}
      </Field>
      <Field name={"cost"} type={"number"}>
        {(store, { onInput, onChange, ...props }) => (
          <TextFieldRoot
            validationState={store.error ? "invalid" : "valid"}
            onChange={(value) => setValue(form, "cost", Number(value))}
          >
            <TextFieldLabel>Costo</TextFieldLabel>
            <TextField {...store} {...props} />
            <TextFieldErrorMessage>{store.error}</TextFieldErrorMessage>
          </TextFieldRoot>
        )}
      </Field>
      <Button disabled={form.submitting || form.validating} type={"submit"}>
        Agregar
      </Button>
    </Form>
  );
}
