import { PanelLeft } from "lucide-react";
import Tooltip from "@/components/tooltip";

export function SidebarHeader({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} px-4 py-3 cursor-pointer`}
    >
      {!collapsed && (
        <span className="text-sm font-semibold text-neutral-100">
          InsightLoop
        </span>
      )}
      <button
        type="button"
        onClick={onToggle}
        className="text-neutral-400 hover:text-neutral-200 cursor-pointer"
      >
        <Tooltip content={collapsed ? "expand" : "collapse"}>
          <PanelLeft size={18} />
        </Tooltip>
      </button>
    </div>
  );
}
