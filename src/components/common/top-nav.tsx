import { A } from "@solidjs/router";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuDescription,
  NavigationMenuIcon,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";

export default function TopNav() {
  return (
    <NavigationMenu class={"container mt-1"} orientation={"horizontal"}>
      <NavigationMenuTrigger as={A} href="/">
        General
      </NavigationMenuTrigger>
      <NavigationMenuTrigger as={A} href="/movements">
        Ingresos / Gastos
      </NavigationMenuTrigger>
      <NavigationMenuTrigger as={A} href="/driver">
        Conductores
      </NavigationMenuTrigger>
      <NavigationMenuTrigger as={A} href={"/client"}>
        Clientes
      </NavigationMenuTrigger>
      <NavigationMenuItem>
        <NavigationMenuTrigger>
          Configuración
          <NavigationMenuIcon />
        </NavigationMenuTrigger>
        <NavigationMenuContent class="grid grid-cols-1 gap-3 md:w-[500px] lg:w-[500px]">
          <NavigationMenuLink as={A} href="/config/movement-type">
            <NavigationMenuLabel>
              Tipos de ingresos / gastos
            </NavigationMenuLabel>
            <NavigationMenuDescription>
              Administración de tipos de ingresos / gastos
            </NavigationMenuDescription>
          </NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenu>
  );
}
