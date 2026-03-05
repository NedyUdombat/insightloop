import type { PublicFeedback } from "@/api/types/IFeedback";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFeedbackStatus } from "./call";
import type { UpdateFeedbackStatusParams } from "./types";

export function useUpdateFeedbackStatus() {
  const queryClient = useQueryClient();

  return useMutation<
    GenericResponse<PublicFeedback>,
    Error,
    UpdateFeedbackStatusParams
  >({
    mutationFn: updateFeedbackStatus,
    onSuccess: (data, variables) => {
      // Invalidate and refetch feedbacks list
      queryClient.invalidateQueries({
        queryKey: ["feedbacks", variables.projectId],
      });
      // Update the individual feedback cache
      queryClient.invalidateQueries({
        queryKey: ["feedback", variables.projectId, variables.feedbackId],
      });
    },
  });
}
