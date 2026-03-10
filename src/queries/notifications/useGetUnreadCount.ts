import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "./call";
import type { GetUnreadCountResponse } from "./types";

const useGetUnreadCount = (projectId?: string) => {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  }: UseQueryResult<GenericResponse<GetUnreadCountResponse>, Error> = useQuery<
    GenericResponse<GetUnreadCountResponse>,
    Error
  >({
    queryKey: ["notifications", "unread-count", projectId],
    queryFn: () => getUnreadCount(projectId),
    retry: false,
  });

  return {
    count: data?.data?.count || 0,
    isPending,
    isError,
    error,
    refetch,
  };
};

export default useGetUnreadCount;
