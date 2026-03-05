"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { type Environment, FeedbackStatus } from "@/generated/prisma/enums";
import { useFeedback } from "./FeedbackContext";

export default function FeedbackFilters() {
  const { filters, setFilters } = useFeedback();
  const [searchInput, setSearchInput] = useState(filters.search || "");

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchInput });
  };

  const handleStatusChange = (value: string) => {
    const status = value === "all" ? undefined : (value as FeedbackStatus);
    setFilters({ ...filters, status });
  };

  const handleEnvironmentChange = (value: string) => {
    const env = value === "all" ? undefined : (value as Environment);
    setFilters({ ...filters, environment: env });
  };

  const handleRatingChange = (value: string) => {
    const rating = value === "all" ? undefined : parseInt(value, 10);
    setFilters({ ...filters, rating });
  };

  const clearFilters = () => {
    setSearchInput("");
    setFilters({
      search: "",
      status: undefined,
      environment: undefined,
      rating: undefined,
      endUserId: undefined,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.environment ||
    filters.rating ||
    filters.endUserId;

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
            placeholder="Search feedback, users, or email..."
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-neutral-700/60 bg-neutral-800/80 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-indigo-500/60 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition"
          />
        </div>

        {/* Status Filter */}
        <select
          id="status"
          value={filters.status || "all"}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded-lg border border-neutral-700/60 bg-neutral-800/80 px-3 py-2 text-sm text-neutral-100 focus:border-indigo-500/60 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value={FeedbackStatus.NEW}>New</option>
          <option value={FeedbackStatus.IN_PROGRESS}>In Progress</option>
          <option value={FeedbackStatus.RESOLVED}>Resolved</option>
          <option value={FeedbackStatus.CLOSED}>Closed</option>
        </select>

        {/* Rating Filter */}
        <select
          id="rating"
          value={filters.rating || "all"}
          onChange={(e) => handleRatingChange(e.target.value)}
          className="rounded-lg border border-neutral-700/60 bg-neutral-800/80 px-3 py-2 text-sm text-neutral-100 focus:border-indigo-500/60 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition cursor-pointer"
        >
          <option value="all">All Ratings</option>
          <option value="5">★★★★★ (5)</option>
          <option value="4">★★★★☆ (4)</option>
          <option value="3">★★★☆☆ (3)</option>
          <option value="2">★★☆☆☆ (2)</option>
          <option value="1">★☆☆☆☆ (1)</option>
        </select>

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
