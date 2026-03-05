// app/onboarding/context.tsx
"use client";

import type { PublicEvent } from "@/api/types/IEvent";
import type { PublicProject } from "@/api/types/IProject";
import useGetRecentEvents from "@/queries/events/useGetRecentEvents";
import useGetProjectById from "@/queries/project/useGetProjectById";
import useGetProjects from "@/queries/project/useGetProjects";
import { createContext, useContext } from "react";

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

  recentEvents: PublicEvent[];
  isRecentEventsPending: boolean;
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
  const { recentEvents, isPending: isRecentEventsPending } =
    useGetRecentEvents(projectId);

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

        recentEvents,
        isRecentEventsPending,
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
