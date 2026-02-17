import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { verifyEmail } from "./call";
import { type VerifyEmailResponse } from "./types";

const useVerifyEmail = () => {
  const {
    isPending,
    isError,
    isSuccess,
    error,
    data,
    mutate,
  }: UseMutationResult<
    GenericResponse<VerifyEmailResponse>,
    Error,
    string
  > = useMutation<GenericResponse<VerifyEmailResponse>, Error, string>({
    mutationFn: (token: string) => verifyEmail(token),
    retry: false,
  });

  return {
    isPending,
    isError,
    isSuccess,
    error,
    data,
    verify: mutate,
  };
};

export default useVerifyEmail;
