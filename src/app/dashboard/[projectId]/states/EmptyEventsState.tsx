import { useState } from "react";
import { useProject } from "../ProjectContext";

export default function EmptyEventsState() {
  const { project } = useProject();
  const apiKey = project?.apiKeys[0]?.keyValue || "N/A";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy API key");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-6">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-8 space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-xl bg-indigo-600/10 p-4 border border-indigo-800">
            🚀
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold">Your project is ready</h1>
          <p className="text-sm text-neutral-400">
            We haven’t received any events yet. Once your app sends its first
            event, you’ll start seeing data here.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 text-sm">
          <Step
            title="Install the SDK"
            description="Add InsightLoop to your app."
          />
          <Step
            title="Initialize with your API key"
            description="Use the key generated during onboarding."
          />
          <Step
            title="Send your first event"
            description="Trigger a simple test event to confirm integration."
          />
        </div>

        {/* Expandable Details */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 space-y-6">
          <div>
            <h3 className="text-xs text-neutral-400 mb-2">Your API Key</h3>
            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 flex items-center justify-between gap-4">
              <code className="text-xs break-all text-neutral-200">
                {apiKey}
              </code>

              <button
                type="button"
                onClick={handleCopy}
                className="text-xs px-3 py-1 rounded-md border border-neutral-700 hover:bg-neutral-800 transition"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 pt-2">
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
        </div>

        <p className="text-center text-xs text-neutral-500">
          Most integrations take less than 5 minutes.
        </p>
      </div>
    </div>
  );
}

function Step({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-neutral-500">✓</div>
      <div>
        <div className="font-medium text-neutral-200">{title}</div>
        <div className="text-xs text-neutral-400">{description}</div>
      </div>
    </div>
  );
}
