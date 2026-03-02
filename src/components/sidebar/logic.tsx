import useGetProjects from "@/queries/project/useGetProjects";

const useSidebarLogic = () => {
  const { projects, isPending, isError, error } = useGetProjects();

  return { projects, isPending, isError, error };
};

export default useSidebarLogic;
