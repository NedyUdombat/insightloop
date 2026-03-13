import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { getEndUsers } from "./call";
import type { GetEndUsersParams, PublicEndUser } from "./type";

export function useGetEndUsers(params: GetEndUsersParams) {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  }: UseQueryResult<GenericResponse<PublicEndUser[]>, Error> = useQuery<
    GenericResponse<PublicEndUser[]>,
    Error
  >({
    queryKey: [
      "endUsers",
      params.projectId,
      params.page,
      params.limit,
      params.search,
    ],
    queryFn: () => getEndUsers(params),
    enabled: !!params.projectId,
  });

  return {
    endUsers: data?.data || [],
    total: data?.meta?.total || 0,
    hasMore: data?.meta?.hasMore || false,
    isPending,
    isError,
    error,
    refetch,
  };
}
