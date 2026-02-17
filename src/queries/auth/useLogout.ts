import { useMutation } from "@tanstack/react-query";
import { logout } from "./call";

const useLogout = () => {
  const { isPending, isError, error, mutate } = useMutation<
    GenericResponse<[]>,
    Error,
    void
  >({
    mutationFn: () => logout(),
    retry: false,
  });

  return {
    isPending,
    isError,
    error,
    logout: mutate,
  };
};

export default useLogout;
