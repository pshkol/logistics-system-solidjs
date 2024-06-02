import { CreateClientDialog } from "~/components/config/client/create-client-dialog";

export default function Client() {
  return (
    <main class={"container flex flex-col gap-2 pt-5"}>
      <aside class={"flex items-center justify-between"}>
        <h1 class={"text-lg font-semibold"}>Clientes</h1>
        <CreateClientDialog />
      </aside>
    </main>
  );
}
