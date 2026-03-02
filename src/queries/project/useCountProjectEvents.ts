import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { countProjectEvents } from "./call";
import type { CountProjectEventsResponse } from "./types";

const useCountProjectEvents = (projectId: string) => {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  }: UseQueryResult<
    GenericResponse<CountProjectEventsResponse>,
    Error
  > = useQuery<GenericResponse<CountProjectEventsResponse>, Error>({
    queryKey: ["count-project-events", projectId],
    queryFn: () => countProjectEvents(projectId),
    refetchInterval: (query) => {
      return query.state.data?.data && Number(query.state.data?.data) > 0
        ? false
        : 10000;
    },
    refetchOnWindowFocus: false,
  });

  return {
    count: data?.data?.count || 0,
    isPending,
    isError,
    error,
    refetch,
  };
};

export default useCountProjectEvents;
