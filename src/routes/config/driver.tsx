import CreateDriverDialog from "~/components/config/driver/create-driver-dialog";

export default function Driver() {
  return (
    <main class={"container pt-5 flex-col flex gap-2"}>
      <aside class={"flex justify-between items-center"}>
        <h1 class={"text-lg font-semibold"}>Conductores</h1>
        <CreateDriverDialog />
      </aside>
    </main>
  );
}
