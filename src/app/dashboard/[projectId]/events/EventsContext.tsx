"use client";

import type { PublicEvent } from "@/api/types/IEvent";
import type { Environment } from "@/generated/prisma/enums";
import { useGetEvents } from "@/queries/events/useGetEvents";
import { createContext, useContext, useState } from "react";
import { useProject } from "../ProjectContext";

interface EventsFilters {
  search?: string;
  eventName?: string;
  startDate?: string;
  endDate?: string;
  environment?: Environment;
  endUserId?: string;
}

interface EventsPagination {
  page: number;
  limit: number;
  total?: number;
  hasMore?: boolean;
}

interface EventsContextType {
  events: PublicEvent[];
  isLoading: boolean;
  error: Error | null;
  filters: EventsFilters;
  setFilters: (filters: EventsFilters) => void;
  pagination: EventsPagination;
  setPagination: (pagination: EventsPagination) => void;
  refetch: () => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const { projectId } = useProject();

  const [filters, setFilters] = useState<EventsFilters>({});
  const [pagination, setPagination] = useState<EventsPagination>({
    page: 1,
    limit: 25,
  });

  const { events, isLoading, error, total, hasMore, refetch } = useGetEvents({
    projectId,
    page: pagination.page,
    limit: pagination.limit,
    ...filters,
  });

  // Update pagination with total and hasMore from the hook
  const paginationWithData: EventsPagination = {
    ...pagination,
    total,
    hasMore,
  };

  return (
    <EventsContext.Provider
      value={{
        events: events || [],
        isLoading,
        error,
        filters,
        setFilters,
        pagination: paginationWithData,
        setPagination,
        refetch,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};
