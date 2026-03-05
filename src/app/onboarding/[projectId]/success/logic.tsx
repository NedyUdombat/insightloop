import useGetProjectFirstEvent from "@/queries/project/useGetProjectFirstEvent";

const useOnboardingSuccessLogic = ({ projectId }: { projectId: string }) => {
  const { event, isPending, isError } = useGetProjectFirstEvent(projectId);
  return { event, isPending, isError };
};

export default useOnboardingSuccessLogic;
