import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { getRecentActivity } from "./call";
import type { RecentActivity } from "./types";

const useGetRecentActivity = (projectId: string) => {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  }: UseQueryResult<GenericResponse<RecentActivity[]>, Error> = useQuery<
    GenericResponse<RecentActivity[]>,
    Error
  >({
    queryKey: ["get-recent-activity", projectId],
    queryFn: () => getRecentActivity(projectId),
    refetchOnWindowFocus: false,
  });

  return {
    recentActivity: data?.data || [],
    isPending,
    isError,
    error,
    refetch,
  };
};

export default useGetRecentActivity;
