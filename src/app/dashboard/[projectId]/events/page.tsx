"use client";

import { useProject } from "../ProjectContext";
import EmptyEventsState from "./EmptyEventsState";
import { EventsProvider, useEvents } from "./EventsContext";
import EventsFilters from "./EventsFilters";
import EventsTable from "./EventsTable";

function EventContent() {
  const { project } = useProject();
  const { events, isLoading } = useEvents();

  // Show loader while data is loading
  if (isLoading) {
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
  if (!isLoading && events.length === 0) {
    return <EmptyEventsState />;
  }

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
            <p className="mt-1 text-sm text-neutral-400">
              View and analyze all events for {project?.name || "your project"}
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
  );
}

export default function EventsPage() {
  return (
    <EventsProvider>
      <EventContent />
    </EventsProvider>
  );
}
