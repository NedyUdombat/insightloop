import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createApiKey } from "./call";
import type { CreateApiKeyPayload, CreateApiKeyResponse } from "./types";

const useCreateApiKey = () => {
  const queryClient = useQueryClient();

  const {
    isPending,
    isError,
    error,
    mutate,
    mutateAsync,
  }: UseMutationResult<
    GenericResponse<CreateApiKeyResponse>,
    Error,
    CreateApiKeyPayload
  > = useMutation<
    GenericResponse<CreateApiKeyResponse>,
    Error,
    CreateApiKeyPayload
  >({
    mutationFn: async (payload) => createApiKey(payload),
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
    createApiKey: mutate,
    createApiKeyAsync: mutateAsync,
  };
};

export default useCreateApiKey;
