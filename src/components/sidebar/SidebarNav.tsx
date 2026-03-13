import {
  Activity,
  AlertTriangle,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";
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
  const params = useParams();
  const currentProjectId = params.projectId as string;
  return (
    <nav className="mt-4 px-2 space-y-1">
      <NavItem
        icon={LayoutDashboard}
        label="Dashboard"
        href={`/dashboard/${currentProjectId}`}
        collapsed={collapsed}
      />

      <NavItem
        icon={Activity}
        label="Events"
        href={`/dashboard/${currentProjectId}/events`}
        collapsed={collapsed}
        disabled={!hasProject}
        disabledReason="Create a project first"
      />

      <NavItem
        icon={MessageSquare}
        label="Feedback"
        href={`/dashboard/${currentProjectId}/feedback`}
        collapsed={collapsed}
        disabled={!hasProject}
        disabledReason="Available after first event"
      />

      <NavItem
        icon={Users}
        label="End Users"
        href={`/dashboard/${currentProjectId}/end-users`}
        collapsed={collapsed}
        disabled={!hasProject}
        disabledReason="Create a project first"
      />

      <NavItem
        icon={AlertTriangle}
        label="Friction"
        href={`/dashboard/${currentProjectId}/friction`}
        collapsed={collapsed}
        disabled={!hasEvents}
        disabledReason="Requires event data"
      />

      <NavItem
        icon={Settings}
        label="Settings"
        href={`/dashboard/${currentProjectId}/settings`}
        collapsed={collapsed}
        disabled={!hasProject}
        disabledReason="Create a project first"
      />
    </nav>
  );
}
