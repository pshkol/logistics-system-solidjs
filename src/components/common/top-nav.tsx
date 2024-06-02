import { A, useLocation } from "@solidjs/router";
import * as Menubar from "@kobalte/core/menubar";
import { Button } from "~/components/ui/button";

export default function TopNav() {
  const location = useLocation();

  const isActive = (path: string) => path === location.pathname;

  return (
    <Menubar.Root
      as={"nav"}
      class={"border-b-[1px] p-2 flex gap-3 border-b-neutral-300"}
    >
      <Menubar.Menu>
        <Menubar.Trigger>
          <Button variant={isActive("/") ? "default" : "link"} as={A} href="/">
            General
          </Button>
        </Menubar.Trigger>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>
          <Button
            variant={isActive("/movement-type") ? "default" : "link"}
            as={A}
            href="/movements"
          >
            Ingresos / Gastos
          </Button>
        </Menubar.Trigger>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>
          <Button variant={isActive("/config") ? "default" : "link"}>
            Configuración
          </Button>
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content class={"p-1 bg-white rounded-lg shadow-md"}>
            <Menubar.Item class={"p-2"}>
              <Button as={A} href="/config/movement-type" variant={"link"}>
                Tipos de ingresos / gastos
              </Button>
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
}
