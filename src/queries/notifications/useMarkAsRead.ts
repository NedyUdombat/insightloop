import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { markAsRead } from "./call";
import type { MarkAsReadPayload, MutationResponse } from "./types";

const useMarkAsRead = () => {
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
    MarkAsReadPayload
  > = useMutation<GenericResponse<MutationResponse>, Error, MarkAsReadPayload>({
    mutationFn: async (payload) => markAsRead(payload),
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
    markAsRead: mutate,
    markAsReadAsync: mutateAsync,
  };
};

export default useMarkAsRead;
