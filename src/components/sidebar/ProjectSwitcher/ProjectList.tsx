import type { PublicProject } from "@/api/types/IProject";
import { ProjectItem } from "./ProjectItem";

export function ProjectList({
  projects,
  selectedProjectId,
  onSelectProject,
}: {
  projects: PublicProject[];
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
}) {
  return (
    <>
      {projects.map((project) => (
        <ProjectItem
          key={project.id}
          project={project}
          isSelected={project.id === selectedProjectId}
          onSelect={() => onSelectProject(project.id)}
        />
      ))}
    </>
  );
}
