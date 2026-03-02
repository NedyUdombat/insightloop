"use client";

import useGetProjects from "@/queries/project/useGetProjects";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CreateProjectForm from "./CreateProjectForm";

export default function CreateProjectPage() {
  const { replace } = useRouter();
  const { projects, isPending } = useGetProjects();

  useEffect(() => {
    if (!isPending && projects.length > 0) {
      replace("/dashboard");
    }
  }, [isPending, projects.length, replace]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
      <CreateProjectForm />
    </div>
  );
}
