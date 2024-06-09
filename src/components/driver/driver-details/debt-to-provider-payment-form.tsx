import {
  TextField,
  TextFieldErrorMessage,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import { createForm, setValue, valiForm } from "@modular-forms/solid";
import { Button } from "~/components/ui/button";
import { DebtToDriverPaymentSchema } from "~/validations/driver/debt-to-driver-payment";

type DebtToProviderPaymentFormProps = {
  driverId: number;
  debtToDriverId: number;
  maxPaymentAmount: number;
  onValidSubmit: (values: DebtToDriverPaymentSchema) => Promise<void>;
};

export default function DebtToProviderPaymentForm(
  props: DebtToProviderPaymentFormProps,
) {
  const [form, { Field, Form }] = createForm<DebtToDriverPaymentSchema>({
    validate: valiForm(DebtToDriverPaymentSchema),
    initialValues: {
      paymentAmount: 0,
      driverId: props.driverId,
      debtToDriverId: props.debtToDriverId,
      maxPaymentAmount: props.maxPaymentAmount,
    },
  });

  return (
    <Form onSubmit={props.onValidSubmit} class={"flex flex-col gap-2"}>
      <Field name={"driverId"} type={"number"}>
        {() => null}
      </Field>
      <Field name={"debtToDriverId"} type={"number"}>
        {() => null}
      </Field>
      <Field name={"maxPaymentAmount"} type={"number"}>
        {() => null}
      </Field>
      <Field name={"paymentAmount"} type={"number"}>
        {(store, { onInput, onChange, ...props }) => (
          <TextFieldRoot
            validationState={store.error ? "invalid" : "valid"}
            onChange={(value) => setValue(form, "paymentAmount", Number(value))}
          >
            <TextFieldLabel>Costo</TextFieldLabel>
            <TextField {...store} {...props} />
            <TextFieldErrorMessage>{store.error}</TextFieldErrorMessage>
          </TextFieldRoot>
        )}
      </Field>
      <Button type={"submit"} disabled={form.submitting || form.validating}>
        Abonar
      </Button>
    </Form>
  );
}
