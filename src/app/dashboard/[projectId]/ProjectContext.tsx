// app/onboarding/context.tsx
"use client";

import { createContext, useContext } from "react";
import type { PublicProject } from "@/api/types/IProject";
import type { RecentActivity } from "@/queries/activity/types";
import useGetRecentActivity from "@/queries/activity/useGetRecentActivity";
import useGetProjectById from "@/queries/project/useGetProjectById";
import useGetProjects from "@/queries/project/useGetProjects";

interface ProjectContextType {
  projectId: string;

  project: PublicProject | null;
  isSingleProjectPending: boolean;
  isSingleProjectError: boolean;
  singleProjectError: Error | null;

  projects: PublicProject[];
  isProjectsPending: boolean;
  isProjectsError: boolean;
  projectsError: Error | null;

  recentActivity: RecentActivity[];
  isRecentActivityPending: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: string;
}) {
  const {
    project,
    isPending: isSingleProjectPending,
    isError: isSingleProjectError,
    error: singleProjectError,
  } = useGetProjectById(projectId);
  const {
    projects,
    isPending: isProjectsPending,
    isError: isProjectsError,
    error: projectsError,
  } = useGetProjects();
  const { recentActivity, isPending: isRecentActivityPending } =
    useGetRecentActivity(projectId);

  return (
    <ProjectContext.Provider
      value={{
        projectId,

        project,
        isSingleProjectPending,
        isSingleProjectError,
        singleProjectError,

        projects,
        isProjectsPending,
        isProjectsError,
        projectsError,

        recentActivity,
        isRecentActivityPending,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
