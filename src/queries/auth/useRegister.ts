import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import type { PublicUser } from "@/api/types/IUser";
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
    mutationFn: async ({ email, password, firstname, lastname }) =>
      register({ email, password, firstname, lastname }),
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