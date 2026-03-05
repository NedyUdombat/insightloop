"use client";
import { useProject } from "./ProjectContext";
import Dashboard from "./states/Dashboard";
import EmptyEventsState from "./states/EmptyEventsState";

export default function DashboardPage() {
  const { project, isSingleProjectPending } = useProject();

  if (isSingleProjectPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-neutral-800 border-t-indigo-500 rounded-full animate-spin" />
          {/* Optional glow effect */}
          <div className="absolute inset-0 w-16 h-16 bg-indigo-600/20 blur-xl rounded-full" />
          <p className="mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  if (project?.eventsCount === 0 && project) {
    return <EmptyEventsState />;
  }

  return <Dashboard />;
}
