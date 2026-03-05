"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import type { Environment } from "@/generated/prisma/enums";
import { useEvents } from "./EventsContext";

export default function EventsFilters() {
  const { filters, setFilters, pagination, setPagination } = useEvents();
  const [searchInput, setSearchInput] = useState(filters.search || "");

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchInput });
    setPagination({ ...pagination, page: 1 });
  };

  const handleLimitChange = (value: string) => {
    const newLimit = parseInt(value, 10);
    setPagination({ ...pagination, limit: newLimit, page: 1 });
  };

  const handleEnvironmentChange = (value: string) => {
    const env = value === "all" ? undefined : (value as Environment);
    setFilters({ ...filters, environment: env });
    setPagination({ ...pagination, page: 1 });
  };

  const clearFilters = () => {
    setSearchInput("");
    setFilters({ search: "", environment: undefined, endUserId: undefined });
    setPagination({ ...pagination, page: 1 });
  };

  const hasActiveFilters =
    filters.search || filters.environment || filters.endUserId;

  return (
    <div className="rounded-lg border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-xl p-4">
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            id="search"
            type="text"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search events, users, or email..."
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-neutral-700/60 bg-neutral-800/80 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-indigo-500/60 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition"
          />
        </div>

        {/* Environment Filter */}
        <select
          id="environment"
          value={filters.environment || "all"}
          onChange={(e) => handleEnvironmentChange(e.target.value)}
          className="rounded-lg border border-neutral-700/60 bg-neutral-800/80 px-3 py-2 text-sm text-neutral-100 focus:border-indigo-500/60 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition cursor-pointer"
        >
          <option value="all">All Environments</option>
          <option value="PRODUCTION">Production</option>
          <option value="STAGING">Staging</option>
          <option value="DEVELOPMENT">Development</option>
        </select>

        {/* Results per page */}
        <select
          id="limit"
          value={pagination.limit}
          onChange={(e) => handleLimitChange(e.target.value)}
          className="rounded-lg border border-neutral-700/60 bg-neutral-800/80 px-3 py-2 text-sm text-neutral-100 focus:border-indigo-500/60 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition cursor-pointer"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-neutral-400 hover:text-neutral-200 transition flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-neutral-800/60"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </form>
    </div>
  );
}
