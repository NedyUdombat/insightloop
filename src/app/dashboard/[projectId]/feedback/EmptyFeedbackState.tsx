import EmptyState from "@/components/EmptyState";
import { useProject } from "../ProjectContext";

export default function EmptyFeedbackState() {
  const { project } = useProject();
  const apiKey = project?.apiKeys[0]?.keyValue || "N/A";
  const apiKeyHint = project?.apiKeys[0]?.keyHint || "N/A";

  return (
    <EmptyState
      title="No feedback yet"
      description="We haven't received any feedback from your users yet. Once users start submitting feedback through your app, you'll see it here."
      topIcon="💬"
      steps={[
        {
          title: "Install the SDK",
          description: "Add InsightLoop to your app if you haven't already.",
        },
        {
          title: "Initialize with your API key",
          description: "Use the key generated during onboarding.",
        },
        {
          title: "Integrate feedback collection",
          description: "Add feedback forms or widgets to collect user input.",
        },
      ]}
      quickStart={{
        apiKey,
        apiKeyHint,
        code: `// Send feedback
insightloop.feedback({
  text: "Great feature!",
  rating: 5,
  properties: {
    featureId: "feature-123"
  }
});`,
      }}
      actions={
        <>
          <a
            href={`/onboarding/${project?.id}/setup`}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 transition"
          >
            Setup Guide →
          </a>

          <a
            href={`/dashboard/${project?.id}/events`}
            className="rounded-md border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800 transition"
          >
            View Events
          </a>
        </>
      }
      footerText="Feedback helps you understand user sentiment and improve your product."
    />
  );
}
