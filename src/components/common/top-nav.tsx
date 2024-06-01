import { A, useLocation } from "@solidjs/router";

export default function TopNav() {
  const location = useLocation();

  const active = (path: string) =>
    path == location.pathname
      ? "border-neutral-600"
      : "border-transparent hover:border-neutral-600";

  return (
    <nav class={"border-b-[1px] border-b-neutral-300"}>
      <ul class="container flex flex-1 items-center p-3 text-gray-800">
        <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
          <A href="/">General</A>
        </li>
        <li class={`border-b-2 ${active("/movements")} mx-1.5 sm:mx-6`}>
          <A href="/movements">Ingresos / Gastos</A>
        </li>
        <li class={`border-b-2 ${active("/config")} mx-1.5 sm:mx-6`}>
          <A href={"/config"}>Configuración</A>
        </li>
      </ul>
    </nav>
  );
}
