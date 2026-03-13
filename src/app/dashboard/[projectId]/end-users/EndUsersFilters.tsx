"use client";

import { useState } from "react";
import { useEndUsers } from "./EndUsersContext";

export default function EndUsersFilters() {
  const { filters, setFilters } = useEndUsers();
  const [searchInput, setSearchInput] = useState(filters.search || "");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    // Debounce search
    const timer = setTimeout(() => {
      setFilters({ ...filters, search: value || undefined });
    }, 300);

    return () => clearTimeout(timer);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search by name, email, or user ID..."
          value={searchInput}
          onChange={handleSearchChange}
          className="w-full px-4 py-2.5 rounded-lg border border-neutral-700/60 bg-neutral-800/60 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition"
        />
      </div>
    </div>
  );
}
