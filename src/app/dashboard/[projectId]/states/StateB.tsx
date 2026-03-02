"use client";

import { useState } from "react";

const API_KEY = "pk_live_xxxxxxxxx"; // replace with real key

export default function StateB() {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="max-w-4xl space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Waiting for your first event</h1>
        <p className="mt-2 text-neutral-400">
          Your project is ready. Send one event to activate InsightLoop.
        </p>
      </div>

      {/* Status */}
      <div className="rounded-md border border-yellow-900 bg-yellow-950/40 px-4 py-3 text-sm text-yellow-400">
        No events received yet. This page will update automatically once an
        event is ingested.
      </div>

      {/* Step 1 */}
      <Step
        number={1}
        title="Install the SDK"
        description="Add the InsightLoop SDK to your application."
      >
        <CodeBlock
          code={`npm install @insightloop/browser`}
          onCopy={() => copy("npm install @insightloop/browser", "install")}
          copied={copied === "install"}
        />
      </Step>

      {/* Step 2 */}
      <Step
        number={2}
        title="Initialize the SDK"
        description="Initialize InsightLoop with your API key."
      >
        <CodeBlock
          code={`import { init } from "@insightloop/browser";

init({
  apiKey: "${API_KEY}"
});`}
          onCopy={() =>
            copy(
              `import { init } from "@insightloop/browser";

init({
  apiKey: "${API_KEY}"
});`,
              "init",
            )
          }
          copied={copied === "init"}
        />
      </Step>

      {/* Step 3 */}
      <Step
        number={3}
        title="Send your first event"
        description="Send a simple event to confirm everything is working."
      >
        <CodeBlock
          code={`import { track } from "@insightloop/browser";

track("page_view", {
  page: "dashboard"
});`}
          onCopy={() =>
            copy(
              `import { track } from "@insightloop/browser";

track("page_view", {
  page: "dashboard"
});`,
              "track",
            )
          }
          copied={copied === "track"}
        />
      </Step>

      {/* Confirmation */}
      <Confirmation />
    </div>
  );
}

/* ---------- Components ---------- */

function Step({
  number,
  title,
  description,
  children,
}: {
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-xs font-medium">
          {number}
        </div>
        <div>
          <h2 className="text-base font-medium">{title}</h2>
          <p className="text-sm text-neutral-400">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function CodeBlock({
  code,
  onCopy,
  copied,
}: {
  code: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="relative rounded-md border border-neutral-800 bg-neutral-950">
      <pre className="overflow-x-auto p-4 text-sm text-neutral-200">
        <code>{code}</code>
      </pre>

      <button
        onClick={onCopy}
        className="absolute right-3 top-3 rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-800"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function Confirmation() {
  const [checking, setChecking] = useState(false);

  function check() {
    setChecking(true);

    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
      <h3 className="text-sm font-medium text-neutral-200">
        Already sent an event?
      </h3>

      <p className="mt-1 text-sm text-neutral-400">
        This page will automatically unlock once an event is received.
      </p>

      <button
        onClick={check}
        disabled={checking}
        className="mt-4 rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-60"
      >
        {checking ? "Checking…" : "I’ve sent an event"}
      </button>

      {checking && (
        <p className="mt-3 text-xs text-neutral-500">
          This usually takes a few seconds.
        </p>
      )}
    </div>
  );
}
