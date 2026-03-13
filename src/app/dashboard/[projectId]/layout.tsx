"use client";

import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import NotificationDropdown from "@/components/NotificationDropdown";
import DashboardSidebar from "@/components/sidebar";
import UserAvatarDropdown from "@/components/UserAvatarDropdown";
import useGetCurrentUser from "@/queries/user/useGetCurrentUser";
import { ProjectProvider } from "./ProjectContext";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";

function LayoutContent({ children }: { children: ReactNode }) {
  const { user: userData } = useGetCurrentUser();
  const { collapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main - add margin-left to account for fixed sidebar */}
      <main
        className={`flex-1 ${collapsed ? "ml-16" : "ml-64"} transition-all duration-200 flex flex-col h-screen`}
      >
        {/* Top bar - fixed at top */}
        <header className="flex items-center justify-between border-b border-neutral-800 px-10 py-4 flex-shrink-0">
          <div className="text-sm text-neutral-400">Dashboard</div>

          <div className="flex items-center gap-6 justify-center">
            <NotificationDropdown />
            {userData && <UserAvatarDropdown user={userData} />}
          </div>
        </header>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-6 py-10">{children}</div>
      </main>
    </div>
  );
}

export default function ProjectLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <ProjectProvider projectId={projectId}>
      <SidebarProvider>
        <LayoutContent>{children}</LayoutContent>
      </SidebarProvider>
    </ProjectProvider>
  );
}
