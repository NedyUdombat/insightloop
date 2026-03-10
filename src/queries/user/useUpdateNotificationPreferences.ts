import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  updateNotificationPreferences,
  type NotificationPreferences,
} from "./call";
import type { UpdateNotificationPreferencesInput } from "@/api/validators/user";

const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();

  const {
    isPending,
    isError,
    error,
    mutate,
    mutateAsync,
  }: UseMutationResult<
    GenericResponse<NotificationPreferences>,
    Error,
    UpdateNotificationPreferencesInput
  > = useMutation({
    mutationFn: (data) => updateNotificationPreferences(data),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationPreferences"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  return {
    isPending,
    isError,
    error,
    updatePreferences: mutate,
    updatePreferencesAsync: mutateAsync,
  };
};

export default useUpdateNotificationPreferences;
