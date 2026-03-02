import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { forgotPassword } from "./call";
import type { ForgotPasswordPayload } from "./types";

const useForgotPassword = () => {
  const {
    isPending,
    isError,
    isSuccess,
    error,
    mutate,
  }: UseMutationResult<
    GenericResponse<[]>,
    Error,
    ForgotPasswordPayload
  > = useMutation<GenericResponse<[]>, Error, ForgotPasswordPayload>({
    mutationFn: (payload) => forgotPassword(payload),
    retry: false,
  });

  return {
    isPending,
    isError,
    isSuccess,
    error,
    forgotPassword: mutate,
  };
};

export default useForgotPassword;
