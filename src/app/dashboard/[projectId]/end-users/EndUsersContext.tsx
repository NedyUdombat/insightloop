"use client";

import { createContext, useContext, useState } from "react";
import type { PublicEndUser } from "@/queries/endusers/type";
import { useGetEndUsers } from "@/queries/endusers/useGetEndUsers";
import { useProject } from "../ProjectContext";

interface EndUsersFilters {
  search?: string;
}

interface EndUsersPagination {
  page: number;
  limit: number;
  total?: number;
  hasMore?: boolean;
}

interface EndUsersContextType {
  endUsers: PublicEndUser[];
  isPending: boolean;
  error: Error | null;
  filters: EndUsersFilters;
  setFilters: (filters: EndUsersFilters) => void;
  pagination: EndUsersPagination;
  setPagination: (pagination: EndUsersPagination) => void;
  refetch: () => void;
}

const EndUsersContext = createContext<EndUsersContextType | undefined>(
  undefined,
);

export function EndUsersProvider({ children }: { children: React.ReactNode }) {
  const { projectId } = useProject();

  const [filters, setFilters] = useState<EndUsersFilters>({});
  const [pagination, setPagination] = useState<EndUsersPagination>({
    page: 1,
    limit: 25,
  });

  const { endUsers, isPending, error, total, hasMore, refetch } =
    useGetEndUsers({
      projectId,
      page: pagination.page,
      limit: pagination.limit,
      ...filters,
    });

  // Update pagination with total and hasMore from the hook
  const paginationWithData: EndUsersPagination = {
    ...pagination,
    total,
    hasMore,
  };

  return (
    <EndUsersContext.Provider
      value={{
        endUsers: endUsers || [],
        isPending,
        error,
        filters,
        setFilters,
        pagination: paginationWithData,
        setPagination,
        refetch,
      }}
    >
      {children}
    </EndUsersContext.Provider>
  );
}

export const useEndUsers = () => {
  const context = useContext(EndUsersContext);
  if (!context) {
    throw new Error("useEndUsers must be used within an EndUsersProvider");
  }
  return context;
};
