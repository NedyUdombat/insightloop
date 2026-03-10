import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteReadNotifications } from "./call";
import type { DeleteReadNotificationsPayload, MutationResponse } from "./types";

const useDeleteReadNotifications = () => {
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
    DeleteReadNotificationsPayload
  > = useMutation<
    GenericResponse<MutationResponse>,
    Error,
    DeleteReadNotificationsPayload
  >({
    mutationFn: async (payload) => deleteReadNotifications(payload),
    onSuccess: () => {
      // Invalidate notifications list
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    retry: false,
  });

  return {
    isPending,
    isError,
    error,
    deleteReadNotifications: mutate,
    deleteReadNotificationsAsync: mutateAsync,
  };
};

export default useDeleteReadNotifications;
