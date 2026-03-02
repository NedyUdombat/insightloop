import DashboardSidebar from "@/components/sidebar";
import type { ReactNode } from "react";
import { ProjectProvider } from "./ProjectContext";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <ProjectProvider projectId={projectId}>
      <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main */}
        <main className="flex-1">
          {/* Top bar */}
          <header className="border-b border-neutral-800 px-6 py-4">
            <div className="text-sm text-neutral-400">Dashboard</div>
          </header>

          <div className="px-6 py-10">{children}</div>
        </main>
      </div>
    </ProjectProvider>
  );
}
