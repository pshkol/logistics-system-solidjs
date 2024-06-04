import { cn } from "~/libs/cn";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as TabsPrimitive from "@kobalte/core/tabs";
import type { ValidComponent, VoidProps } from "solid-js";
import { splitProps } from "solid-js";

type TabsProps = TabsPrimitive.TabsRootProps & {
  class?: string;
};

export const Tabs = <T extends ValidComponent = "div">(props: PolymorphicProps<T, TabsProps>) => {
  const [local, rest] = splitProps(props as TabsProps, ["class"]);

  return (
    <TabsPrimitive.Root
      class={cn("w-full data-[orientation=vertical]:flex", local.class)}
      {...rest}
    />
  );
};

type TabsListProps = TabsPrimitive.TabsListProps & {
  class?: string;
};

export const TabsList = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TabsListProps>
) => {
  const [local, rest] = splitProps(props as TabsListProps, ["class"]);

  return (
    <TabsPrimitive.List
      class={cn(
        "relative flex h-9 rounded-lg bg-muted p-1 text-muted-foreground data-[orientation=vertical]:flex-col data-[orientation=horizontal]:items-center data-[orientation=vertical]:items-stretch data-[orientation=horizontal]:border-b data-[orientation=vertical]:border-r",
        local.class
      )}
      {...rest}
    />
  );
};

type TabsContentProps = TabsPrimitive.TabsContentProps & {
  class?: string;
};

export const TabsContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TabsContentProps>
) => {
  const [local, rest] = splitProps(props as TabsContentProps, ["class"]);

  return (
    <TabsPrimitive.Content
      class={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring focus-visible:ring-offset-2",
        local.class
      )}
      {...rest}
    />
  );
};

type TabsTriggerProps = TabsPrimitive.TabsTriggerProps & {
  class?: string;
};

export const TabsTrigger = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, TabsTriggerProps>
) => {
  const [local, rest] = splitProps(props as TabsTriggerProps, ["class"]);

  return (
    <TabsPrimitive.Trigger
      class={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-shadow focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow",
        local.class
      )}
      {...rest}
    />
  );
};

type TabsIndicatorProps = VoidProps<
  TabsPrimitive.TabsIndicatorProps & {
    class?: string;
  }
>;

export const TabsIndicator = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TabsIndicatorProps>
) => {
  const [local, rest] = splitProps(props as TabsIndicatorProps, ["class"]);

  return (
    <TabsPrimitive.Indicator
      class={cn(
        "absolute transition-all duration-200 data-[orientation=horizontal]:-bottom-[1px] data-[orientation=vertical]:-right-[1px] data-[orientation=horizontal]:h-[2px] data-[orientation=vertical]:w-[2px]",
        local.class
      )}
      {...rest}
    />
  );
};
