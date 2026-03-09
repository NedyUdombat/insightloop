import { type UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PublicUser } from "@/api/types/IUser";
import type { UpdateUserInput } from "@/api/validators/user";
import { updateUserProfile } from "./call";

const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const {
    isPending,
    isError,
    error,
    mutate,
    mutateAsync,
  }: UseMutationResult<
    GenericResponse<PublicUser>,
    Error,
    UpdateUserInput
  > = useMutation<GenericResponse<PublicUser>, Error, UpdateUserInput>({
    mutationFn: (data) => updateUserProfile(data),
    retry: false,
    onSuccess: () => {
      // Invalidate the current user query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  return {
    isPending,
    isError,
    error,
    updateProfile: mutate,
    updateProfileAsync: mutateAsync,
  };
};

export default useUpdateProfile;
