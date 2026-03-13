"use client";

import dynamic from "next/dynamic";
import { useSidebar } from "@/contexts/SidebarContext";
import useSidebarLogic from "./logic";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNav } from "./SidebarNav";

const ProjectSwitcher = dynamic(() => import("./ProjectSwitcher"), {
  ssr: false,
});

export default function Sidebar() {
  const { collapsed, setCollapsed } = useSidebar();

  const { projects, project } = useSidebarLogic();

  return (
    <aside
      className={`
    ${collapsed ? "w-16" : "w-64"}
    h-screen
    min-h-screen
    fixed
    left-0
    top-0
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

      <ProjectSwitcher collapsed={collapsed} projects={projects} />

      <SidebarNav
        collapsed={collapsed}
        hasProject={!!project}
        hasEvents={(project && project?.eventsCount > 0) || false}
      />

      <div className="flex-1" />

      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
}
