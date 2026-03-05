import type { PublicUser } from "@/api/types/IUser";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "./call";

const useGetCurrentUser = () => {
  const {
    data,
    isPending,
    isError,
    error,
  }: UseQueryResult<GenericResponse<PublicUser>, Error> = useQuery<
    GenericResponse<PublicUser>,
    Error
  >({
    queryKey: ["currentUser"],
    queryFn: () => fetchCurrentUser(),
    retry: false,
  });

  return {
    user: data?.data || null,
    isPending,
    isError,
    error,
  };
};

export default useGetCurrentUser;
