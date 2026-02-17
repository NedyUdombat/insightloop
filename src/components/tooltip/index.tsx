import { Tooltip as TooltipComponent } from "radix-ui";

type SidebarTooltipProps = {
  content: string;
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
};

export default function Tooltip({
  content,
  children,
  side = "right",
  align = "center",
}: SidebarTooltipProps) {
  return (
    <TooltipComponent.Provider delayDuration={200}>
      <TooltipComponent.Root>
        <TooltipComponent.Trigger asChild>{children}</TooltipComponent.Trigger>
        <TooltipComponent.Portal>
          <TooltipComponent.Content
            side={side}
            align={align}
            className="
              z-50
              rounded-md border border-neutral-800
              bg-neutral-900
              px-2 py-1
              text-xs text-neutral-300
              shadow-md
            "
          >
            {content}
          </TooltipComponent.Content>
        </TooltipComponent.Portal>
      </TooltipComponent.Root>
    </TooltipComponent.Provider>
  );
}
