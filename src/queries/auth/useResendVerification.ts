import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { resendVerification } from "./call";

const useResendVerification = () => {
  const {
    isPending,
    isError,
    isSuccess,
    error,
    mutate,
  }: UseMutationResult<GenericResponse<[]>, Error, void> = useMutation<
    GenericResponse<[]>,
    Error,
    void
  >({
    mutationFn: () => resendVerification(),
    retry: false,
  });

  return {
    isPending,
    isError,
    isSuccess,
    error,
    resend: mutate,
  };
};

export default useResendVerification;
