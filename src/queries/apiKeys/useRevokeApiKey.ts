import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { revokeApiKey } from "./call";
import type { RevokeApiKeyPayload } from "./types";

const useRevokeApiKey = () => {
  const queryClient = useQueryClient();

  const {
    isPending,
    isError,
    error,
    mutate,
    mutateAsync,
  }: UseMutationResult<
    GenericResponse<{ success: boolean }>,
    Error,
    RevokeApiKeyPayload
  > = useMutation<
    GenericResponse<{ success: boolean }>,
    Error,
    RevokeApiKeyPayload
  >({
    mutationFn: async (payload) => revokeApiKey(payload),
    onSuccess: (_, variables) => {
      // Invalidate the API keys query to refetch the list
      queryClient.invalidateQueries({
        queryKey: ["apiKeys", variables.projectId],
      });
    },
    retry: false,
  });

  return {
    isPending,
    isError,
    error,
    revokeApiKey: mutate,
    revokeApiKeyAsync: mutateAsync,
  };
};

export default useRevokeApiKey;
