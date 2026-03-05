import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { deleteProject } from "./call";
import type { DeleteProjectResponse } from "./types";

interface UseDeleteProjectParams {
  projectId: string;
}

const useDeleteProject = () => {
  const {
    isPending,
    isError,
    error,
    mutate,
    mutateAsync,
  }: UseMutationResult<
    GenericResponse<DeleteProjectResponse>,
    Error,
    UseDeleteProjectParams
  > = useMutation<
    GenericResponse<DeleteProjectResponse>,
    Error,
    UseDeleteProjectParams
  >({
    mutationFn: async ({ projectId }) => deleteProject(projectId),
    retry: false,
  });

  return {
    isPending,
    isError,
    error,
    deleteProject: mutate,
    deleteProjectAsync: mutateAsync,
  };
};

export default useDeleteProject;
