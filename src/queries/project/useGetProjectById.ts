import type { PublicProject } from "@/api/types/IProject";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { getProjectById } from "./call";

const useGetProjectById = (projectId: string) => {
  const {
    data,
    isPending,
    isError,
    error,
  }: UseQueryResult<GenericResponse<PublicProject>, Error> = useQuery<
    GenericResponse<PublicProject>,
    Error
  >({
    queryKey: ["projects", projectId],
    queryFn: () => getProjectById(projectId),
  });

  return {
    project: data?.data || null,
    isPending,
    isError,
    error,
  };
};

export default useGetProjectById;
