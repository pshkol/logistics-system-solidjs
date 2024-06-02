import { createForm, valiForm } from "@modular-forms/solid";
import { ClientSchema } from "~/validations/config/client";
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import { Button } from "~/components/ui/button";

type ClientFormProps = {
  onValidSubmit: (values: ClientSchema) => Promise<void>;
};

export default function ClientForm(props: ClientFormProps) {
  const [form, { Form, Field }] = createForm<ClientSchema>({
    validate: valiForm(ClientSchema),
  });

  return (
    <Form onSubmit={props.onValidSubmit} class={"flex flex-col gap-2"}>
      <Field name={"name"} type={"string"}>
        {(store, props) => (
          <TextFieldRoot validationState={store.error ? "invalid" : "valid"}>
            <TextFieldLabel>Nombre</TextFieldLabel>
            <TextField {...props} />
            <TextFieldErrorMessage>{store.error}</TextFieldErrorMessage>
          </TextFieldRoot>
        )}
      </Field>
      <Button type={"submit"} disabled={form.submitting || form.validating}>
        Crear cliente
      </Button>
    </Form>
  );
}
