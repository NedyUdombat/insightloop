"use client";

import { Copy, Eye, EyeOff } from "lucide-react";
import { type ReactNode, useState } from "react";

interface Step {
  title: string;
  description: string;
}

interface QuickStart {
  apiKey: string;
  apiKeyHint: string;
  code: string;
}

interface EmptyStateProps {
  title: string;
  description: string;
  topIcon: string | ReactNode;
  quickStart?: QuickStart;
  steps: Step[];
  actions?: ReactNode;
  footerText?: string;
}

export default function EmptyState({
  title,
  description,
  topIcon,
  quickStart,
  steps,
  actions,
  footerText,
}: EmptyStateProps) {
  const [_copied, setCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleCopy = async () => {
    if (!quickStart) return;
    try {
      await navigator.clipboard.writeText(quickStart.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy API key");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-8 space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-xl bg-indigo-600/10 p-4 border border-indigo-800">
            {typeof topIcon === "string" ? (
              <span className="text-2xl">{topIcon}</span>
            ) : (
              topIcon
            )}
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-neutral-400">{description}</p>
        </div>

        {/* Steps */}
        <div className="space-y-4 text-sm">
          {steps.map((step) => (
            <StepItem
              key={step.title}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>

        {/* Quick Start Section (Optional) */}
        {quickStart && (
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 space-y-6">
            <div>
              <h3 className="text-xs text-neutral-400 mb-2">Your API Key</h3>
              <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 flex items-center justify-between gap-4">
                <code className="text-xs break-all text-neutral-200">
                  {showApiKey ? quickStart.apiKey : quickStart.apiKeyHint}
                </code>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="text-neutral-400 hover:text-white cursor-pointer"
                    title={showApiKey ? "Hide API key" : "Show API key"}
                  >
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-neutral-400 hover:text-white cursor-pointer"
                    title="Copy API key"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Example Code */}
            <div>
              <h3 className="text-xs text-neutral-400 mb-2">Quick Start</h3>
              <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                <pre className="text-xs text-neutral-300 overflow-x-auto">
                  <code>{quickStart.code}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Actions (Optional) */}
        {actions && (
          <div className="flex items-center justify-center gap-4 pt-2">
            {actions}
          </div>
        )}

        {/* Footer Text (Optional) */}
        {footerText && (
          <p className="text-center text-xs text-neutral-500">{footerText}</p>
        )}
      </div>
    </div>
  );
}

function StepItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
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
