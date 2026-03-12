import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { register } from "./call";
import type { RegisterPayload } from "./types";

const useRegister = () => {
  const {
    isPending,
    isError,
    error,
    mutate,
  }: UseMutationResult<
    GenericResponse<[]>,
    Error,
    RegisterPayload
  > = useMutation<GenericResponse<[]>, Error, RegisterPayload>({
    mutationFn: async ({ email, password, firstName, lastName }) =>
      register({ email, password, firstName, lastName }),
    retry: false,
  });

  return {
    isPending,
    isError,
    error,
    register: mutate,
  };
};

export default useRegister;
