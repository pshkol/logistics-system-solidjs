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
import DebtToProviderPaymentForm from "~/components/driver/driver-details/debt-to-provider-payment-form";
import { DebtToDriverPaymentSchema } from "~/validations/driver/debt-to-driver-payment";
import { db } from "~/db/db";
import { paymentToDriverSchema } from "~/db/schema";
import { revalidate } from "@solidjs/router";
import { createSignal } from "solid-js";

type AddDebtToProviderPaymentDialogProps = {
  driverId: number;
  debtToDriverId: number;
  maxPaymentAmount: number;
  onPaymentAdded: () => void;
};

const createPaymentToDriver = async (values: DebtToDriverPaymentSchema) => {
  "use server";

  await db.insert(paymentToDriverSchema).values({
    amount: values.paymentAmount,
    debtToDriverId: values.debtToDriverId,
    driverId: values.driverId,
  });
};

export default function AddDebtToProviderPaymentDialog(
  props: AddDebtToProviderPaymentDialogProps,
) {
  const [open, setOpen] = createSignal(false);

  const handleCreatePayment = async (values: DebtToDriverPaymentSchema) => {
    await createPaymentToDriver(values).then(() => {
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
          <DialogDescription>Abonar deuda a un conductor</DialogDescription>
        </DialogHeader>
        <DebtToProviderPaymentForm
          debtToDriverId={props.debtToDriverId}
          driverId={props.driverId}
          maxPaymentAmount={props.maxPaymentAmount}
          onValidSubmit={handleCreatePayment}
        />
      </DialogContent>
    </Dialog>
  );
}
