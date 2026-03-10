import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { getNotificationPreferences, type NotificationPreferences } from "./call";

const useGetNotificationPreferences = () => {
  const {
    data,
    isPending,
    isError,
    error,
  }: UseQueryResult<GenericResponse<NotificationPreferences>, Error> = useQuery(
    {
      queryKey: ["notificationPreferences"],
      queryFn: () => getNotificationPreferences(),
      retry: false,
    },
  );

  return {
    preferences: data?.data || null,
    isPending,
    isError,
    error,
  };
};

export default useGetNotificationPreferences;
