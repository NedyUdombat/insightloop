"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { PublicProject } from "@/api/types/IProject";
import type { Environment } from "@/generated/prisma/enums";
import useDeleteProject from "@/queries/project/useDeleteProject";
import useUpdateProject from "@/queries/project/useUpdateProject";
import { useProject } from "../ProjectContext";

export interface ProjectPreferences {
  eventNotifications: boolean;
  feedbackNotifications: boolean;
  systemNotifications: boolean;
  securityNotifications: boolean;
  autoArchive: boolean;
  retentionDays: number;
  defaultEnvironment: Environment;
}

const useProjectSettingsLogic = () => {
  const { project, projectId, projects, isSingleProjectPending } = useProject();
  const router = useRouter();

  // Form state
  const [projectName, setProjectName] = useState(project?.name || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Preferences state
  const [preferences, setPreferences] = useState<ProjectPreferences>({
    eventNotifications: true,
    feedbackNotifications: true,
    systemNotifications: true,
    securityNotifications: true,
    autoArchive: false,
    retentionDays: 30,
    defaultEnvironment: "PRODUCTION" as Environment,
  });

  useEffect(() => {
    if (project) {
      setProjectName(project.name);
      // Load preferences from project data
      setPreferences({
        eventNotifications: project.eventNotifications ?? true,
        feedbackNotifications: project.feedbackNotifications ?? true,
        systemNotifications: project.systemNotifications ?? true,
        securityNotifications: project.securityNotifications ?? true,
        autoArchive: project.autoArchive ?? false,
        retentionDays: project.retentionDays ?? 30,
        defaultEnvironment:
          (project.defaultEnvironment as Environment) ?? "PRODUCTION",
      });
    }
  }, [project]);

  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // TanStack Query mutations
  const { updateProject: updateProjectMutation, isPending: isUpdating } =
    useUpdateProject();

  const { deleteProject: deleteProjectMutation, isPending: isDeleting } =
    useDeleteProject();

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToastMessage(message);
    setToastType(type);
    setToastOpen(true);
  };

  const handleUpdateProject = () => {
    if (!projectName.trim()) {
      setError("Project name cannot be empty");
      return;
    }

    setError(null);

    updateProjectMutation(
      {
        projectId,
        name: projectName,
        preferences,
      },
      {
        onSuccess: () => {
          showToast("Project updated successfully!");
        },
        onError: (err) => {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to update project";
          setError(errorMessage);
          showToast(errorMessage, "error");
        },
      },
    );
  };

  const handleDeleteProject = () => {
    if (deleteConfirmText !== project?.name) {
      setError("Project name does not match");
      return;
    }

    setError(null);

    deleteProjectMutation(
      { projectId },
      {
        onSuccess: () => {
          showToast("Project deleted successfully!");

          // Find another project to redirect to
          const remainingProjects = projects.filter((p) => p.id !== projectId);

          if (remainingProjects.length > 0) {
            // Find the project that comes before the deleted one, or the first alphabetically
            const currentIndex = projects.findIndex((p) => p.id === projectId);
            let targetProject: PublicProject;

            if (currentIndex > 0) {
              // Redirect to the previous project in the list
              targetProject = projects[currentIndex - 1];
            } else {
              // Redirect to the first project alphabetically
              const sortedProjects = [...remainingProjects].sort((a, b) =>
                a.name.localeCompare(b.name),
              );
              targetProject = sortedProjects[0];
            }

            router.push(`/dashboard/${targetProject.id}`);
          } else {
            // No projects left, redirect to dashboard
            router.push("/dashboard");
          }
        },
        onError: (err) => {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to delete project";
          setError(errorMessage);
          showToast(errorMessage, "error");
        },
      },
    );
  };

  return {
    project,
    projectId,
    projectName,
    setProjectName,
    showDeleteConfirm,
    setShowDeleteConfirm,
    deleteConfirmText,
    setDeleteConfirmText,
    error,
    setError,
    preferences,
    setPreferences,
    toastOpen,
    setToastOpen,
    toastMessage,
    toastType,
    handleUpdateProject,
    handleDeleteProject,
    isUpdating,
    isDeleting,
    isSingleProjectPending,
  };
};

export default useProjectSettingsLogic;
