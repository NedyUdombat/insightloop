import { useProject } from "@/app/dashboard/[projectId]/ProjectContext";

const useSidebarLogic = () => {
  const {
    projectId,
    projects,
    isProjectsPending,
    isProjectsError,
    projectsError,
    project,
  } = useProject();

  return {
    projects,
    isProjectsPending,
    isProjectsError,
    projectsError,
    projectId,
    project,
  };
};

export default useSidebarLogic;
