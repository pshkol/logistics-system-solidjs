import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { FaRegularMoneyBill1 } from "solid-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { db } from "~/db/db";
import { clientPaymentSchema } from "~/db/schema";
import { createSignal } from "solid-js";
import { set } from "date-fns";
import ClientPaymentForm from "~/components/client/driver-details/client-payment-form";
import { ClientPaymentSchema } from "~/validations/client/client-payment-schema";

type AddClientPaymentDialogProps = {
  clientId: number;
  clientDebtId: number;
  maxPaymentAmount: number;
  onPaymentAdded: () => void;
};

const createClientPayment = async (values: ClientPaymentSchema) => {
  "use server";

  const [year, month, day] = values.date.split("-").map(Number);

  await db.insert(clientPaymentSchema).values({
    amount: values.paymentAmount,
    clientDebtId: values.clientDebtId,
    clientId: values.clientId,
    paymentDate: set(new Date(), {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
      year,
      month: month - 1,
      date: day,
    }),
  });
};

export default function AddClientPaymentDialog(
  props: AddClientPaymentDialogProps,
) {
  const [open, setOpen] = createSignal(false);

  const handleCreatePayment = async (values: ClientPaymentSchema) => {
    await createClientPayment(values).then(() => {
      props.onPaymentAdded();
      setOpen(false);
    });
  };

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger>
          <DialogTrigger as={Button} class={"h-9 w-9"} variant={"ghost"}>
            <FaRegularMoneyBill1 size={"18"} />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Abonar deuda</TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Abonar deuda</DialogTitle>
          <DialogDescription>Abonar deuda de un cliente</DialogDescription>
        </DialogHeader>
        <ClientPaymentForm
          clientDebtId={props.clientDebtId}
          clientId={props.clientId}
          maxPaymentAmount={props.maxPaymentAmount}
          onValidSubmit={handleCreatePayment}
        />
      </DialogContent>
    </Dialog>
  );
}
