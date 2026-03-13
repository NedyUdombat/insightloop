"use client";

import { useProject } from "../ProjectContext";
import EmptyEndUsersState from "./EmptyEndUsersState";
import { EndUsersProvider, useEndUsers } from "./EndUsersContext";
import EndUsersFilters from "./EndUsersFilters";
import EndUsersTable from "./EndUsersTable";

function EndUsersContent() {
  const { project } = useProject();
  const { endUsers, isPending } = useEndUsers();

  // Show loader while data is loading
  if (isPending) {
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

  // Show empty state if no users have been identified yet
  if (endUsers.length === 0) {
    return <EmptyEndUsersState />;
  }

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">End Users</h1>
            <p className="mt-1 text-sm text-neutral-400">
              View and manage end users for {project?.name || "your project"}
            </p>
          </div>
        </div>

        {/* Accent Divider */}
        <div className="h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/40 to-indigo-500/0" />

        {/* Filters */}
        <EndUsersFilters />

        {/* End Users Table */}
        <EndUsersTable />
      </div>
    </div>
  );
}

export default function EndUsersPage() {
  return (
    <EndUsersProvider>
      <EndUsersContent />
    </EndUsersProvider>
  );
}
