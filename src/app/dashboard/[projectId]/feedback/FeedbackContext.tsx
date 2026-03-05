"use client";

import type { PublicFeedback } from "@/api/types/IFeedback";
import type { Environment, FeedbackStatus } from "@/generated/prisma/enums";
import { useGetFeedbacks } from "@/queries/feedback/useGetFeedbacks";
import { createContext, useContext, useState } from "react";
import { useProject } from "../ProjectContext";

interface FeedbackFilters {
  search?: string;
  status?: FeedbackStatus;
  environment?: Environment;
  rating?: number;
  endUserId?: string;
}

interface FeedbackPagination {
  page: number;
  limit: number;
  total?: number;
  hasMore?: boolean;
}

interface FeedbackContextType {
  feedbacks: PublicFeedback[];
  isPending: boolean;
  error: Error | null;
  filters: FeedbackFilters;
  setFilters: (filters: FeedbackFilters) => void;
  pagination: FeedbackPagination;
  setPagination: (pagination: FeedbackPagination) => void;
  refetch: () => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(
  undefined,
);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const { projectId } = useProject();

  const [filters, setFilters] = useState<FeedbackFilters>({});
  const [pagination, setPagination] = useState<FeedbackPagination>({
    page: 1,
    limit: 25,
  });

  const { feedbacks, isPending, error, total, hasMore, refetch } =
    useGetFeedbacks({
      projectId,
      page: pagination.page,
      limit: pagination.limit,
      ...filters,
    });

  // Update pagination with total and hasMore from the hook
  const paginationWithData: FeedbackPagination = {
    ...pagination,
    total,
    hasMore,
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedbacks: feedbacks || [],
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
    </FeedbackContext.Provider>
  );
}

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
};
