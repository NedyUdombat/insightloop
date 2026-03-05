"use client";

import DashboardSidebar from "@/components/sidebar";
import { getInitialsFromName } from "@/lib/utils";
import useGetCurrentUser from "@/queries/user/useGetCurrentUser";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { ProjectProvider } from "./ProjectContext";

export default function ProjectLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const projectId = params.projectId as string;
  const { user: userData } = useGetCurrentUser();

  return (
    <ProjectProvider projectId={projectId}>
      <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main - add margin-left to account for fixed sidebar */}
        <main className="flex-1 ml-64 flex flex-col h-screen">
          {/* Top bar - fixed at top */}
          <header className="flex items-center justify-between border-b border-neutral-800 px-10 py-4 flex-shrink-0">
            <div className="text-sm text-neutral-400">Dashboard</div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                className="text-neutral-400 hover:text-neutral-200"
              >
                🔔
              </button>

              {userData && (
                <div className="h-8 w-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-xs font-medium">
                  {getInitialsFromName(
                    userData?.email,
                    userData?.firstname,
                    userData?.lastname,
                  )}
                </div>
              )}
            </div>
          </header>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto px-6 py-10">{children}</div>
        </main>
      </div>
    </ProjectProvider>
  );
}
