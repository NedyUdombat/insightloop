import { ReactNode } from "react";
import DashboardSidebar from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
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
  );
}
