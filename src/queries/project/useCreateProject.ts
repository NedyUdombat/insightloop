import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { createProject } from "./call";
import type { CreateProjectPayload, CreateProjectResponse } from "./types";

const useCreateProject = () => {
  const {
    isPending,
    isError,
    error,
    mutate,
  }: UseMutationResult<
    GenericResponse<CreateProjectResponse>,
    Error,
    CreateProjectPayload
  > = useMutation<
    GenericResponse<CreateProjectResponse>,
    Error,
    CreateProjectPayload
  >({
    mutationFn: async (payload) => createProject(payload),
    retry: false,
  });

  return {
    isPending,
    isError,
    error,
    createProject: mutate,
  };
};

export default useCreateProject;
