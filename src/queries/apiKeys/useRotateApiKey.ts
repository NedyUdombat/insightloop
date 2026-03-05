import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { rotateApiKey } from "./call";
import type { RotateApiKeyPayload, RotateApiKeyResponse } from "./types";

const useRotateApiKey = () => {
  const queryClient = useQueryClient();

  const {
    isPending,
    isError,
    error,
    mutate,
    mutateAsync,
  }: UseMutationResult<
    GenericResponse<RotateApiKeyResponse>,
    Error,
    RotateApiKeyPayload
  > = useMutation<
    GenericResponse<RotateApiKeyResponse>,
    Error,
    RotateApiKeyPayload
  >({
    mutationFn: async (payload) => rotateApiKey(payload),
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
    rotateApiKey: mutate,
    rotateApiKeyAsync: mutateAsync,
  };
};

export default useRotateApiKey;
