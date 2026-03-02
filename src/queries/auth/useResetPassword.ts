import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { resetPassword } from "./call";
import type { ResetPasswordPayload } from "./types";

const useResetPassword = () => {
  const {
    isPending,
    isError,
    error,
    mutate,
  }: UseMutationResult<
    GenericResponse<[]>,
    Error,
    ResetPasswordPayload
  > = useMutation<GenericResponse<[]>, Error, ResetPasswordPayload>({
    mutationFn: (payload) => resetPassword(payload),
    retry: false,
  });

  return {
    isPending,
    isError,
    error,
    resetPassword: mutate,
  };
};

export default useResetPassword;
