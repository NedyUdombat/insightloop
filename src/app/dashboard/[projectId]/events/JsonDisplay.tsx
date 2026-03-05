"use client";

import { useState } from "react";

interface JsonDisplayProps {
  data: Record<string, any>;
}

export default function JsonDisplay({ data }: JsonDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 rounded-md bg-neutral-800 px-2.5 py-1.5 text-xs text-neutral-300 hover:bg-neutral-700 transition opacity-0 group-hover:opacity-100"
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 overflow-x-auto">
        <pre className="text-xs font-mono text-neutral-300">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
