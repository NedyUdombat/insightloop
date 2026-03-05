import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { PublicEvent } from "@/api/types/IEvent";
import { getEvents } from "./call";
import type { GetEventsParams } from "./types";

export function useGetEvents(params: GetEventsParams) {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  }: UseQueryResult<GenericResponse<PublicEvent[]>, Error> = useQuery<
    GenericResponse<PublicEvent[]>,
    Error
  >({
    queryKey: [
      "events",
      params.projectId,
      params.page,
      params.limit,
      params.search,
      params.eventName,
      params.startDate,
      params.endDate,
      params.endUserId,
    ],
    queryFn: () => getEvents(params),
    enabled: !!params.projectId,
  });

  return {
    events: data?.data || [],
    total: data?.meta?.total || 0,
    hasMore: data?.meta?.hasMore || false,
    isLoading: isPending,
    isError,
    error,
    refetch,
  };
}
