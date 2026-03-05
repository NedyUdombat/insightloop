import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { getProjectFirstEvent } from "./call";
import type { GetProjectFirstEventResponse } from "./types";

const useGetProjectFirstEvent = (projectId: string) => {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  }: UseQueryResult<
    GenericResponse<GetProjectFirstEventResponse>,
    Error
  > = useQuery<GenericResponse<GetProjectFirstEventResponse>, Error>({
    queryKey: ["get-project-first-event", projectId],
    queryFn: () => getProjectFirstEvent(projectId),

    refetchOnWindowFocus: false,
  });

  return {
    event: data?.data,
    isPending,
    isError,
    error,
    refetch,
  };
};

export default useGetProjectFirstEvent;
