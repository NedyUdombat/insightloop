"use client";

import { useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { ProjectSwitcher } from "./ProjectSwitcher";
import { SidebarNav } from "./SidebarNav";
import { SidebarFooter } from "./SidebarFooter";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // fake app state
  const hasProject = false;
  const hasEvents = false;

  return (
    <aside
      className={`
    ${collapsed ? "w-16" : "w-64"}
    h-screen
    min-h-screen
    transition-all duration-200
    border-r border-neutral-800
    bg-neutral-900
    flex flex-col
    overflow-hidden
  `}
    >
      <SidebarHeader
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
      />

      <ProjectSwitcher collapsed={collapsed} />

      <SidebarNav
        collapsed={collapsed}
        hasProject={hasProject}
        hasEvents={hasEvents}
      />

      <div className="flex-1" />

      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
}
