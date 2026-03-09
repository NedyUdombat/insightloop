"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Environment } from "@/generated/prisma/enums";
import useCreateProject from "@/queries/project/useCreateProject";

interface ProjectSettings {
  eventNotifications: boolean;
  feedbackNotifications: boolean;
  systemNotifications: boolean;
  securityNotifications: boolean;
  autoArchive: boolean;
  retentionDays: number;
  defaultEnvironment: Environment;
}

const useCreateProjectLogic = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Settings state
  const [settings, setSettings] = useState<ProjectSettings>({
    eventNotifications: true,
    feedbackNotifications: true,
    systemNotifications: true,
    securityNotifications: true,
    autoArchive: false,
    retentionDays: 30,
    defaultEnvironment: "PRODUCTION" as Environment,
  });

  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const { createProject, isPending: loading } = useCreateProject();

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToastMessage(message);
    setToastType(type);
    setToastOpen(true);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      createProject(
        {
          name,
          eventNotifications: settings.eventNotifications,
          feedbackNotifications: settings.feedbackNotifications,
          systemNotifications: settings.systemNotifications,
          securityNotifications: settings.securityNotifications,
          autoArchive: settings.autoArchive,
          retentionDays: settings.retentionDays,
          defaultEnvironment: settings.defaultEnvironment,
        },
        {
          onSuccess: (data) => {
            const projectId = data.data.project.id;
            showToast("Project created successfully!", "success");
            // Redirect to the new project dashboard after a brief delay
            setTimeout(() => {
              router.push(`/dashboard/${projectId}`);
            }, 500);
          },
          onError: (err) => {
            const errorMessage = err.message || "Failed to create project";
            setError(errorMessage);
            showToast(errorMessage, "error");
          },
        },
      );
    } catch (err: unknown) {
      const errorMessage =
        (err instanceof Error ? err.message : null) ||
        "Failed to create project";
      setError(errorMessage);
      showToast(errorMessage, "error");
    }
  }

  return {
    name,
    setName,
    settings,
    setSettings,
    loading,
    error,
    handleSubmit,
    toastOpen,
    setToastOpen,
    toastMessage,
    toastType,
  };
};

export default useCreateProjectLogic;
