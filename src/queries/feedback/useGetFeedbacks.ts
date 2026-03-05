import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { PublicFeedback } from "@/api/types/IFeedback";
import { getFeedbacks } from "./call";
import type { GetFeedbacksParams } from "./types";

export function useGetFeedbacks(params: GetFeedbacksParams) {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  }: UseQueryResult<GenericResponse<PublicFeedback[]>, Error> = useQuery<
    GenericResponse<PublicFeedback[]>,
    Error
  >({
    queryKey: [
      "feedbacks",
      params.projectId,
      params.page,
      params.limit,
      params.search,
      params.status,
      params.environment,
      params.rating,
      params.endUserId,
    ],
    queryFn: () => getFeedbacks(params),
    enabled: !!params.projectId,
  });

  return {
    feedbacks: data?.data || [],
    total: data?.meta?.total || 0,
    hasMore: data?.meta?.hasMore || false,
    isPending,
    isError,
    error,
    refetch,
  };
}
