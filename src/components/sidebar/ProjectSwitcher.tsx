import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";

export function ProjectSwitcher({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="px-3">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className="
              w-full flex items-center justify-between
              rounded-md border border-neutral-800
              bg-neutral-950 px-3 py-2
              text-sm text-neutral-300
            "
          >
            {!collapsed && "No project selected"}
            <ChevronDown size={14} />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="right"
            align="start"
            className="min-w-[220px] rounded-md border border-neutral-800 bg-neutral-900 p-2"
          >
            <div className="px-2 py-1 text-xs text-neutral-400">
              No projects yet
            </div>

            <DropdownMenu.Separator className="my-1 h-px bg-neutral-800" />

            <DropdownMenu.Item asChild>
              <button
                className="
                  w-full flex items-center gap-2
                  rounded-md px-2 py-2
                  text-sm text-indigo-400
                  hover:bg-neutral-800
                "
              >
                <Plus size={14} />
                Create new project
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
