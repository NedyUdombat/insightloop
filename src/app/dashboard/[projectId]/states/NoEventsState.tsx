"use client";

import { Activity, ArrowRight, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProject } from "../ProjectContext";

export default function NoEventsState() {
  const router = useRouter();
  const { projectId } = useProject();

  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-10 max-w-xl w-full shadow-xl">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <Rocket className="h-6 w-6 text-indigo-400" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold tracking-tight">
          Your project is ready 🚀
        </h2>

        <p className="mt-3 text-sm text-neutral-400">
          We haven’t received any events yet. Once your app sends its first
          event, you’ll start seeing data here.
        </p>

        {/* Checklist */}
        <div className="mt-8 text-left space-y-4">
          <div className="flex items-start gap-3">
            <Activity className="mt-1 h-4 w-4 text-neutral-500" />
            <div>
              <p className="text-sm font-medium">Install the SDK</p>
              <p className="text-xs text-neutral-500">
                Add InsightLoop to your app.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Activity className="mt-1 h-4 w-4 text-neutral-500" />
            <div>
              <p className="text-sm font-medium">
                Initialize with your API key
              </p>
              <p className="text-xs text-neutral-500">
                Use the key generated during onboarding.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Activity className="mt-1 h-4 w-4 text-neutral-500" />
            <div>
              <p className="text-sm font-medium">Send your first event</p>
              <p className="text-xs text-neutral-500">
                Trigger a simple test event to confirm integration.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => router.push(`/onboarding/${projectId}/setup`)}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition"
          >
            Continue setup
            <ArrowRight size={14} />
          </button>

          <button
            onClick={() => router.push(`/dashboard/${projectId}/events`)}
            className="rounded-md border border-neutral-700 px-5 py-2.5 text-sm text-neutral-300 hover:border-neutral-500 hover:text-white transition"
          >
            View Events
          </button>
        </div>

        {/* Footer hint */}
        <p className="mt-8 text-xs text-neutral-500">
          Most integrations take less than 5 minutes.
        </p>
      </div>
    </div>
  );
}
