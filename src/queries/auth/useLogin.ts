import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import type { PublicUser } from "@/api/types/IUser";
import { authenticate } from "./call";
import type { AuthenticatePayload } from "./types";

const useLogin = () => {
  const {
    isPending,
    isError,
    error,
    mutate,
  }: UseMutationResult<
    GenericResponse<PublicUser>,
    Error,
    AuthenticatePayload
  > = useMutation<GenericResponse<PublicUser>, Error, AuthenticatePayload>({
    mutationFn: (payload) => authenticate(payload),
    retry: false,
  });

  return {
    isPending,
    isError,
    error,
    login: mutate,
  };
};

export default useLogin;
