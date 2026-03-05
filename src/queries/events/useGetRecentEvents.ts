import type { PublicEvent } from "@/api/types/IEvent";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { getRecentEvents } from "./call";

const useGetRecentEvents = (projectId: string) => {
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
    queryKey: ["get-recent-events", projectId],
    queryFn: () => getRecentEvents(projectId),
    refetchOnWindowFocus: false,
  });

  return {
    recentEvents: data?.data || [],
    isPending,
    isError,
    error,
    refetch,
  };
};

export default useGetRecentEvents;
