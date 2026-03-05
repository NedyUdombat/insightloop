import EmptyState from "@/components/EmptyState";
import { useProject } from "../ProjectContext";

export default function EmptyDataState() {
  const { project } = useProject();
  const apiKey = project?.apiKeys[0]?.keyValue || "N/A";
  const apiKeyHint = project?.apiKeys[0]?.keyHint || "N/A";

  return (
    <EmptyState
      title="Your project is ready"
      description="We haven't received any events yet. Once your app sends its first event, you'll start seeing data here."
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
          title: "Send your first event",
          description: "Trigger a simple test event to confirm integration.",
        },
        {
          title: "Send your first feedback",
          description: "Collect user feedback to start gathering insights.",
        },
      ]}
      quickStart={{
        apiKey,
        apiKeyHint,
        code: `// Track an event
insightloop.track({
  event: "button_clicked",
  properties: {
    buttonId: "submit-btn",
    page: "checkout"
  }
});

// Collect user feedback
insightloop.feedback({
  rating: 5,
  comment: "Great feature!",
  metadata: {
    feature: "checkout",
    userId: "user_123"
  }
});`,
      }}
      actions={
        <>
          <a
            href={`/onboarding/${project?.id}/setup`}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 transition"
          >
            Continue setup →
          </a>

          <a
            href={`/dashboard/${project?.id}/events`}
            className="rounded-md border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800 transition"
          >
            View Events
          </a>
        </>
      }
      footerText="Most integrations take less than 5 minutes."
    />
  );
}
