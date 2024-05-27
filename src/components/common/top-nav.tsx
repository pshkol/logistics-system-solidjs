import { A, useLocation } from "@solidjs/router";

export default function TopNav() {
  const location = useLocation();

  const active = (path: string) =>
    path == location.pathname
      ? "border-neutral-600"
      : "border-transparent hover:border-neutral-600";

  return (
    <nav>
      <ul class="container flex items-center p-3 text-gray-800">
        <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
          <A href="/">General</A>
        </li>
        <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
          <A href="/movements">Ingresos / Gastos</A>
        </li>
      </ul>
    </nav>
  );
}
