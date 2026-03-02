import useCreateProject from "@/queries/project/useCreateProject";
import useGetProjects from "@/queries/project/useGetProjects";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useOnboarding } from "../OnboardingContext";

const useCreateProjectLogic = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { projects, isPending } = useGetProjects();

  // Client-side guard
  useEffect(() => {
    if (!isPending && projects.length > 0) {
      router.replace("/dashboard");
    }
  }, [isPending, projects, router.replace]);

  const { setApiKey } = useOnboarding();
  const { createProject } = useCreateProject();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // setApiKey("abracadabra");
    // router.push(`/onboarding/projectId/setup`);
    //

    try {
      createProject(
        { name },
        {
          onSuccess: (data) => {
            setApiKey(data.data.apiKey.value);
            router.push(`/onboarding/${data.data.project.id}/setup`);
          },
          onError: (err) => {
            setError(err.message);
          },
        },
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    name,
    setName,
    loading,
    error,
    handleSubmit,
  };
};

export default useCreateProjectLogic;
