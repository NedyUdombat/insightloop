import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "./call";
import type { ResetPasswordPayload } from "./types";

const useResetPassword = () => {
  const { isPending, isError, error, mutate } = useMutation<
    GenericResponse<[]>,
    Error,
    ResetPasswordPayload
  >({
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
