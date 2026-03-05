"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import type { PublicProject } from "@/api/types/IProject";
import { ProjectList } from "./ProjectList";

interface ProjectSwitcherProps {
  collapsed: boolean;
  projects: PublicProject[];
}

const getCreateProjectRoute = (hasProjects: boolean): string => {
  return hasProjects ? "/projects/new" : "/onboarding/create-project";
};

export default function ProjectSwitcher({
  collapsed,
  projects = [],
}: ProjectSwitcherProps) {
  const router = useRouter();
  const params = useParams();
  const currentProjectId = params.projectId as string;

  const selectedProject = projects.find((p) => p.id === currentProjectId);
  const hasProjects = projects.length > 0;

  const handleCreateProject = () => {
    router.push(getCreateProjectRoute(hasProjects));
  };

  return (
    <div className="px-3">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="w-full focus:outline-none cursor-pointer flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300"
          >
            {!collapsed && (selectedProject?.name ?? "No project selected")}
            <ChevronDown size={14} />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="right"
            align="start"
            className="min-w-[220px] rounded-md border border-neutral-800 bg-neutral-900 p-2"
          >
            {hasProjects ? (
              <ProjectList
                projects={projects}
                selectedProjectId={currentProjectId}
                onSelectProject={(id) => router.push(`/dashboard/${id}`)}
              />
            ) : (
              <div className="px-2 py-1 text-xs text-neutral-400">
                No projects yet
              </div>
            )}

            <DropdownMenu.Separator className="my-1 h-px bg-neutral-800" />

            <DropdownMenu.Item asChild>
              <button
                type="button"
                className="w-full focus:outline-none cursor-pointer flex items-center gap-2 rounded-md px-2 py-2 text-sm text-indigo-400 hover:bg-neutral-800"
                onClick={handleCreateProject}
              >
                <Plus size={14} />
                Create new project
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
