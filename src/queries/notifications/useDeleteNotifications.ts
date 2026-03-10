import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteNotifications } from "./call";
import type { DeleteNotificationsPayload, MutationResponse } from "./types";

const useDeleteNotifications = () => {
  const queryClient = useQueryClient();

  const {
    isPending,
    isError,
    error,
    mutate,
    mutateAsync,
  }: UseMutationResult<
    GenericResponse<MutationResponse>,
    Error,
    DeleteNotificationsPayload
  > = useMutation<
    GenericResponse<MutationResponse>,
    Error,
    DeleteNotificationsPayload
  >({
    mutationFn: async (payload) => deleteNotifications(payload),
    onSuccess: () => {
      // Invalidate notifications list and unread count
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    retry: false,
  });

  return {
    isPending,
    isError,
    error,
    deleteNotifications: mutate,
    deleteNotificationsAsync: mutateAsync,
  };
};

export default useDeleteNotifications;
