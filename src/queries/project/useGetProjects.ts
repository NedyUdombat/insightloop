import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { PublicProject } from "@/api/types/IProject";
import { getProjectList } from "./call";

const useGetProjects = () => {
  const {
    data,
    isPending,
    isError,
    error,
  }: UseQueryResult<GenericResponse<PublicProject[]>, Error> = useQuery<
    GenericResponse<PublicProject[]>,
    Error
  >({
    queryKey: ["projects"],
    queryFn: () => getProjectList(),
  });

  return {
    projects: data?.data || [],
    isPending,
    isError,
    error,
  };
};

export default useGetProjects;
