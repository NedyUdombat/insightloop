import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { updateProject } from "./call";
import type { UpdateProjectPayload, UpdateProjectResponse } from "./types";

const useUpdateProject = () => {
  const {
    isPending,
    isError,
    error,
    mutate,
    mutateAsync,
  }: UseMutationResult<
    GenericResponse<UpdateProjectResponse>,
    Error,
    UpdateProjectPayload
  > = useMutation<
    GenericResponse<UpdateProjectResponse>,
    Error,
    UpdateProjectPayload
  >({
    mutationFn: async (payload) => updateProject(payload),
    retry: false,
  });

  return {
    isPending,
    isError,
    error,
    updateProject: mutate,
    updateProjectAsync: mutateAsync,
  };
};

export default useUpdateProject;
