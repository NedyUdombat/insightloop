import {
  LayoutDashboard,
  Activity,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { NavItem } from "./NavItem";

export function SidebarNav({
  collapsed,
  hasProject,
  hasEvents,
}: {
  collapsed: boolean;
  hasProject: boolean;
  hasEvents: boolean;
}) {
  return (
    <nav className="mt-4 px-2 space-y-1">
      <NavItem
        icon={LayoutDashboard}
        label="Dashboard"
        href="/dashboard"
        collapsed={collapsed}
      />

      <NavItem
        icon={Activity}
        label="Events"
        href="/events"
        collapsed={collapsed}
        disabled={!hasProject}
        disabledReason="Create a project first"
      />

      <NavItem
        icon={MessageSquare}
        label="Feedback"
        href="/feedback"
        collapsed={collapsed}
        disabled={!hasEvents}
        disabledReason="Available after first event"
      />

      <NavItem
        icon={AlertTriangle}
        label="Friction"
        href="/friction"
        collapsed={collapsed}
        disabled={!hasEvents}
        disabledReason="Requires event data"
      />
    </nav>
  );
}
