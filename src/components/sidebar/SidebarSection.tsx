import * as Popover from "@radix-ui/react-popover";
import { MoreHorizontal } from "lucide-react";

export function SidebarSection({
  icon: Icon,
  label,
  collapsed,
  children,
}: {
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="
            w-full flex items-center justify-between
            px-3 py-2 rounded-md text-sm
            text-neutral-300 hover:bg-neutral-800
          "
        >
          <div className="flex items-center gap-3">
            <Icon size={18} />
            {!collapsed && <span>{label}</span>}
          </div>
          {!collapsed && <MoreHorizontal size={16} />}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="right"
          align="end"
          className="min-w-55 rounded-md border border-neutral-800 bg-neutral-900 p-2"
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
