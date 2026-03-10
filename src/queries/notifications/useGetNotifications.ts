import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { getNotifications } from "./call";
import type { GetNotificationsParams, GetNotificationsResponse } from "./types";

const useGetNotifications = (params: GetNotificationsParams = {}) => {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  }: UseQueryResult<GenericResponse<GetNotificationsResponse>, Error> =
    useQuery<GenericResponse<GetNotificationsResponse>, Error>({
      queryKey: ["notifications", params],
      queryFn: () => getNotifications(params),
      retry: false,
    });

  return {
    notifications: data?.data?.notifications || [],
    total: data?.data?.total || 0,
    limit: data?.data?.limit || 50,
    offset: data?.data?.offset || 0,
    hasMore: data?.data?.hasMore || false,
    isPending,
    isError,
    error,
    refetch,
  };
};

export default useGetNotifications;
