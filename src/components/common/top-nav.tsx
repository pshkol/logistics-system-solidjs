import { A, useLocation } from "@solidjs/router";
import * as Menubar from "@kobalte/core/menubar";
import { Button } from "~/components/ui/button";

export default function TopNav() {
  const location = useLocation();

  const isActive = (path: string) => path === location.pathname;

  return (
    <Menubar.Root
      as={"nav"}
      class={"flex gap-3 border-b-[1px] border-b-neutral-300 p-2"}
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
            variant={isActive("/movements") ? "default" : "link"}
            as={A}
            href="/movements"
          >
            Ingresos / Gastos
          </Button>
        </Menubar.Trigger>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger>
          <Button
            variant={isActive("/driver") ? "default" : "link"}
            as={A}
            href="/driver"
          >
            Conductores
          </Button>
        </Menubar.Trigger>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger
          as={Button}
          variant={
            isActive("/config/movement-type") || isActive("/config/client")
              ? "default"
              : "link"
          }
        >
          Configuración
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content
            class={"w-[15rem] rounded-lg bg-white p-1 shadow-md"}
          >
            <Menubar.Item class={"p-2"}>
              <Button
                class={"inline-block w-full"}
                as={A}
                href="/config/movement-type"
                variant={"link"}
              >
                Tipos de ingresos / gastos
              </Button>
            </Menubar.Item>
            <Menubar.Item class={"p-2"}>
              <Button
                class={"inline-block w-full"}
                as={A}
                href="/config/client"
                variant={"link"}
              >
                Clientes
              </Button>
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
}
