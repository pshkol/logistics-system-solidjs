import {
  TextField,
  TextFieldErrorMessage,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import { createForm, setValue, valiForm } from "@modular-forms/solid";
import { Button } from "~/components/ui/button";
import { ClientPaymentSchema } from "~/validations/client/client-payment-schema";
import { format } from "date-fns";

type ClientPaymentFormProps = {
  clientId: number;
  clientDebtId: number;
  maxPaymentAmount: number;
  onValidSubmit: (values: ClientPaymentSchema) => Promise<void>;
};

export default function ClientPaymentForm(props: ClientPaymentFormProps) {
  const [form, { Field, Form }] = createForm<ClientPaymentSchema>({
    validate: valiForm(ClientPaymentSchema),
    initialValues: {
      paymentAmount: 0,
      clientId: props.clientId,
      clientDebtId: props.clientDebtId,
      maxPaymentAmount: props.maxPaymentAmount,
      date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  return (
    <Form onSubmit={props.onValidSubmit} class={"flex flex-col gap-2"}>
      <Field name={"clientId"} type={"number"}>
        {() => null}
      </Field>
      <Field name={"clientDebtId"} type={"number"}>
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
      <Field name={"date"} type={"string"}>
        {(store) => (
          <TextFieldRoot
            validationState={store.error ? "invalid" : "valid"}
            onChange={(value) => {
              setValue(form, "date", value);
            }}
            value={store.value}
          >
            <TextFieldLabel>Fecha</TextFieldLabel>
            <TextField type={"date"} />
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
