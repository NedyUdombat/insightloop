"use client";
import EmptyState from "@/components/EmptyState";
import { useProject } from "../ProjectContext";

export default function EmptyEndUsersState() {
  const { project } = useProject();
  const apiKey = project?.apiKeys[0]?.keyValue || "N/A";
  const apiKeyHint = project?.apiKeys[0]?.keyHint || "N/A";

  return (
    <EmptyState
      title=" No End Users Yet"
      description="End users will appear here once you identify them using the SDK."
      topIcon="🚀"
      steps={[
        {
          title: "Install the SDK",
          description: "Add InsightLoop to your app.",
        },
        {
          title: "Initialize with your API key",
          description: "Use the key generated during onboarding.",
        },
        {
          title: "Identify your first end user",
          description: "Identify a user after creation to manage end-user",
        },
      ]}
      quickStart={{
        apiKey,
        apiKeyHint,
        code: `// Track an event
insightloop.identify({
  userId: "user_123",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe"
});`,
      }}
      actions={
        <a
          href={`/onboarding/${project?.id}/setup`}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 transition"
        >
          Continue setup →
        </a>
      }
      footerText="Most integrations take less than 5 minutes."
    />
  );
}
