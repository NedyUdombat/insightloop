import type { IProject } from "@/api/types/IProject";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { getProjectList } from "./call";

const useGetProjects = () => {
  const {
    data,
    isPending,
    isError,
    error,
  }: UseQueryResult<GenericResponse<IProject[]>, Error> = useQuery<
    GenericResponse<IProject[]>,
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
