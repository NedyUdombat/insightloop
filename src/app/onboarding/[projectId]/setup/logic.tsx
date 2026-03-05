"use client";

import useCountProjectEvents from "@/queries/project/useCountProjectEvents";
import useGetProjectById from "@/queries/project/useGetProjectById";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type SdkType = "browser" | "node" | "react-native";
export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

const useSetupLogic = () => {
  const router = useRouter();
  const params = useParams();
  const [activeSdk, setActiveSdk] = useState<SdkType>("browser");
  const [activePm, setActivePm] = useState<PackageManager>("npm");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("Copied to clipboard!");

  const projectId = (params.projectId as string) || "123";
  const { project, isPending, isError } = useGetProjectById(projectId);
  const {
    count,
    isPending: isCountPending,
    refetch,
  } = useCountProjectEvents(projectId);

  // 🔹 INSTALL COMMAND
  const getInstallCommand = () => {
    const base = `@insightloop/${activeSdk}`;

    const map = {
      npm: `npm install ${base}`,
      yarn: `yarn add ${base}`,
      pnpm: `pnpm add ${base}`,
      bun: `bun add ${base}`,
    };

    return map[activePm];
  };

  // 🔹 INITIALIZE CODE
  const getInitializeCode = () => {
    return `import { init } from "@insightloop/${activeSdk}";

      init({
        apiKey: "${project?.apiKeys[0]?.keyValue}"
      });`;
  };

  // 🔹 TRACK CODE
  const getTrackCode = () => {
    return `import { track } from "@insightloop/${activeSdk}";

      track("app_started", {
        source: "onboarding"
      });`;
  };

  useEffect(() => {
    if (Number(count) > 0) {
      console.log("Events have been tracked! Redirecting to success page...");
      setTimeout(() => {
        router.push(`/onboarding/${projectId}/success`);
      }, 1000);
    }
  }, [count, router, projectId]);

  const handleCopy = async ({
    value,
    toast,
  }: {
    value: string | undefined;
    toast: string;
  }) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);

    setToastMessage(toast);
    setToastOpen(true);
  };

  return {
    project,
    projectId,
    toastOpen,
    setToastOpen,
    handleCopy,
    isPending,
    isError,
    apiKey: project?.apiKeys[0]?.keyValue,
    toastMessage,
    getInstallCommand,
    getInitializeCode,
    getTrackCode,
    activeSdk,
    setActiveSdk,
    activePm,
    setActivePm,
    count,
    refetch,
  };
};

export default useSetupLogic;
