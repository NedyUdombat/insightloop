"use client";

import { useProject } from "../ProjectContext";
import { EventsProvider } from "./EventsContext";
import EventsFilters from "./EventsFilters";
import EventsTable from "./EventsTable";

export default function EventsPage() {
  const { project } = useProject();

  return (
    <EventsProvider>
      <div className="flex justify-center px-4">
        <div className="w-full max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
              <p className="mt-1 text-sm text-neutral-400">
                View and analyze all events for{" "}
                {project?.name || "your project"}
              </p>
            </div>
          </div>

          {/* Accent Divider */}
          <div className="h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/40 to-indigo-500/0" />

          {/* Filters */}
          <EventsFilters />

          {/* Events Table */}
          <EventsTable />
        </div>
      </div>
    </EventsProvider>
  );
}
