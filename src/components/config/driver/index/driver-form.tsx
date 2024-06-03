import { createForm, valiForm } from "@modular-forms/solid";
import { DriverSchema } from "~/validations/config/driver-schema";
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import { Button } from "~/components/ui/button";

type DriverFormProps = {
  onValidSubmit: (values: DriverSchema) => Promise<void>;
};

export default function DriverForm(props: DriverFormProps) {
  const [form, { Form, Field }] = createForm<DriverSchema>({
    validate: valiForm(DriverSchema),
  });

  return (
    <Form onSubmit={props.onValidSubmit} class={"flex flex-col gap-2"}>
      <Field name={"name"}>
        {(store, props) => (
          <TextFieldRoot validationState={store.error ? "invalid" : "valid"}>
            <TextFieldLabel>Nombre</TextFieldLabel>
            {/*@ts-expect-error - It's ok*/}
            <TextField {...store} {...props} />
            <TextFieldErrorMessage>{store.error}</TextFieldErrorMessage>
          </TextFieldRoot>
        )}
      </Field>
      <Field name={"lastName"}>
        {(store, props) => (
          <TextFieldRoot validationState={store.error ? "invalid" : "valid"}>
            <TextFieldLabel>Apellido</TextFieldLabel>
            {/*@ts-expect-error - It's ok*/}
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
