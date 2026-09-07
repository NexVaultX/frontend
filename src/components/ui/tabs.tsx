import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "cn";

const Tabs = ({ className, ...props }: TabsPrimitive.Root.Props) => (
  <TabsPrimitive.Root
    data-slot="tabs"
    className={cn("flex flex-col gap-4", className)}
    {...props}
  />
);

const TabsList = ({ className, ...props }: TabsPrimitive.List.Props) => (
  <TabsPrimitive.List
    data-slot="tabs-list"
    className={cn(
      "bg-muted text-muted-foreground inline-flex h-11 w-full items-center justify-start gap-1 rounded-xl p-1 sm:w-auto",
      className
    )}
    {...props}
  />
);

const TabsTrigger = ({ className, ...props }: TabsPrimitive.Tab.Props) => (
  <TabsPrimitive.Tab
    data-slot="tabs-trigger"
    className={cn(
      "data-active:bg-background data-active:text-foreground focus-visible:ring-ring inline-flex min-h-9 flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none sm:flex-none",
      className
    )}
    {...props}
  />
);

const TabsContent = ({ className, ...props }: TabsPrimitive.Panel.Props) => (
  <TabsPrimitive.Panel
    data-slot="tabs-content"
    className={cn(
      "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
      className
    )}
    {...props}
  />
);

export { Tabs, TabsContent, TabsList, TabsTrigger };
