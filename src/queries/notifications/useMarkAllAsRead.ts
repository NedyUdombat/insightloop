import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { markAllAsRead } from "./call";
import type { MarkAllAsReadPayload, MutationResponse } from "./types";

const useMarkAllAsRead = () => {
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
    MarkAllAsReadPayload
  > = useMutation<
    GenericResponse<MutationResponse>,
    Error,
    MarkAllAsReadPayload
  >({
    mutationFn: async (payload) => markAllAsRead(payload),
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
    markAllAsRead: mutate,
    markAllAsReadAsync: mutateAsync,
  };
};

export default useMarkAllAsRead;
