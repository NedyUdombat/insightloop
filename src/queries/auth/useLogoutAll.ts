import { useMutation } from "@tanstack/react-query";
import { logoutAll } from "./call";

const useLogoutAll = () => {
  const { isPending, isError, error, mutate } = useMutation<
    GenericResponse<[]>,
    Error,
    void
  >({
    mutationFn: () => logoutAll(),
    retry: false,
  });

  return {
    isPending,
    isError,
    error,
    logoutAll: mutate,
  };
};

export default useLogoutAll;
