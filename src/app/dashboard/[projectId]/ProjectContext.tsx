// app/onboarding/context.tsx
"use client";

import { createContext, useContext } from "react";

interface ProjectContextType {
  projectId: string | null;
}

const ProjectContext = createContext<ProjectContextType>({
  projectId: null,
});

export function ProjectProvider({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: string;
}) {
  return (
    <ProjectContext.Provider value={{ projectId }}>
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
