"use client";

import type { IProject } from "@/api/types/IProject";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProjectSwitcherProps {
  collapsed: boolean;
  projects: IProject[];
}

export default function ProjectSwitcher({
  collapsed,
  projects = [],
}: ProjectSwitcherProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null,
  );
  const router = useRouter();

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="px-3">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="
              w-full flex items-center justify-between
              rounded-md border border-neutral-800
              bg-neutral-950 px-3 py-2
              text-sm text-neutral-300
            "
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
            {projects.length === 0 ? (
              <div className="px-2 py-1 text-xs text-neutral-400">
                No projects yet
              </div>
            ) : (
              projects.map((project) => (
                <DropdownMenu.Item key={project.id} asChild>
                  <button
                    type="button"
                    onClick={() => setSelectedProjectId(project.id)}
                    className={`
                      w-full text-left rounded-md px-2 py-2 text-sm
                      hover:bg-neutral-800
                      ${
                        project.id === selectedProjectId
                          ? "bg-neutral-800 text-white"
                          : "text-neutral-300"
                      }
                    `}
                  >
                    {project.name}
                  </button>
                </DropdownMenu.Item>
              ))
            )}

            <DropdownMenu.Separator className="my-1 h-px bg-neutral-800" />

            <DropdownMenu.Item asChild>
              <button
                type="button"
                className="
                  w-full flex items-center gap-2
                  rounded-md px-2 py-2
                  text-sm text-indigo-400
                  hover:bg-neutral-800
                "
                onClick={() => {
                  router.push(
                    projects.length === 0
                      ? "/onboarding/create-project"
                      : "/projects/create",
                  );
                }}
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
