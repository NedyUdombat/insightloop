import type { PublicFeedback } from "@/api/types/IFeedback";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { getFeedback } from "./call";

export function useGetFeedback(projectId: string, feedbackId: string) {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  }: UseQueryResult<GenericResponse<PublicFeedback>, Error> = useQuery<
    GenericResponse<PublicFeedback>,
    Error
  >({
    queryKey: ["feedback", projectId, feedbackId],
    queryFn: () => getFeedback(projectId, feedbackId),
    enabled: !!projectId && !!feedbackId,
  });

  return {
    feedback: data?.data,
    isLoading: isPending,
    isError,
    error,
    refetch,
  };
}
