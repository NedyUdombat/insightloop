import EmptyState from "@/components/EmptyState";
import { useProject } from "../ProjectContext";

export default function EmptyEventsState() {
  const { project } = useProject();
  const apiKey = project?.apiKeys[0]?.keyValue || "N/A";
  const apiKeyHint = project?.apiKeys[0]?.keyHint || "N/A";

  return (
    <EmptyState
      title="No events yet"
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
