import { type UseMutationResult, useMutation } from "@tanstack/react-query";
import { changePassword } from "./call";

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

const useChangePassword = () => {
  const {
    isPending,
    isError,
    error,
    mutate,
    mutateAsync,
  }: UseMutationResult<
    GenericResponse<{ message: string }>,
    Error,
    ChangePasswordPayload
  > = useMutation<
    GenericResponse<{ message: string }>,
    Error,
    ChangePasswordPayload
  >({
    mutationFn: (data) => changePassword(data),
    retry: false,
  });

  return {
    isPending,
    isError,
    error,
    changePassword: mutate,
    changePasswordAsync: mutateAsync,
  };
};

export default useChangePassword;
