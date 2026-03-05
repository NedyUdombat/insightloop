import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { getApiKeys } from "./call";
import type { GetApiKeysResponse } from "./types";

const useGetApiKeys = (projectId: string) => {
  const {
    isPending,
    isError,
    error,
    data,
    refetch,
  }: UseQueryResult<GenericResponse<GetApiKeysResponse>, Error> = useQuery<
    GenericResponse<GetApiKeysResponse>,
    Error
  >({
    queryKey: ["apiKeys", projectId],
    queryFn: () => getApiKeys(projectId),
    enabled: !!projectId,
  });

  return {
    isPending,
    isError,
    error,
    data: data?.data,
    refetch,
  };
};

export default useGetApiKeys;
