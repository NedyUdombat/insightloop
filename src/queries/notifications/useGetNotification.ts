import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { PublicNotification } from "@/api/types/INotification";
import { getNotificationById } from "./call";

const useGetNotification = (notificationId: string) => {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  }: UseQueryResult<GenericResponse<PublicNotification>, Error> = useQuery<
    GenericResponse<PublicNotification>,
    Error
  >({
    queryKey: ["notifications", notificationId],
    queryFn: () => getNotificationById(notificationId),
    retry: false,
    enabled: !!notificationId,
  });

  return {
    notification: data?.data || null,
    isPending,
    isError,
    error,
    refetch,
  };
};

export default useGetNotification;
