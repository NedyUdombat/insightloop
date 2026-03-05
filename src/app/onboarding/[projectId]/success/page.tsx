"use client";

import { formatDistanceToNow } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import useOnboardingSuccessLogic from "./logic";

export default function SuccessPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;

  const { event, isPending, isError } = useOnboardingSuccessLogic({
    projectId,
  });

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center px-6">
      <div className="w-full max-w-3xl">
        {/* Onboarding Header (consistent with setup page) */}
        <div className="max-w-3xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
            Step 2 of 2
          </p>

          <div className="h-1 w-full bg-neutral-800 rounded-full mb-4">
            <div className="h-1 w-full bg-indigo-500 rounded-full" />
          </div>

          <h1 className="text-2xl font-semibold text-white">
            Activate InsightLoop
          </h1>

          <p className="text-neutral-400 mt-2">Your project is now live.</p>
        </div>

        {/* Main Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8">
            {isPending && (
              <div className="text-center py-10">
                <p className="text-neutral-400">
                  Loading activation details...
                </p>
              </div>
            )}

            {(isError || !event) && !isPending && (
              <div className="text-center py-10">
                <p className="text-red-400 mb-6">Could not load first event.</p>
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/${projectId}`)}
                  className="bg-white text-black px-5 py-2 rounded-lg font-medium hover:bg-neutral-200 transition"
                >
                  Go to Dashboard →
                </button>
              </div>
            )}

            {event && !isPending && !isError && (
              <>
                {/* Success Header */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-white">
                    🎉 Project Activated
                  </h2>
                  <p className="text-neutral-400 mt-2">
                    We’ve received your first event.
                  </p>
                </div>

                {/* First Event Preview */}
                <div className="bg-neutral-800 rounded-lg p-6 mb-8">
                  <p className="text-xs uppercase tracking-wide text-neutral-500 mb-3">
                    First Event
                  </p>

                  <p className="text-lg font-semibold text-white">
                    {event.eventName}
                  </p>

                  <p className="text-xs text-neutral-500 mt-1">
                    {formatDistanceToNow(new Date(event.createdAt), {
                      addSuffix: true,
                    })}
                  </p>

                  {event.properties &&
                    Object.keys(event.properties).length > 0 && (
                      <pre className="mt-5 text-xs bg-neutral-900 p-4 rounded text-neutral-300 overflow-x-auto">
                        {JSON.stringify(event.properties, null, 2)}
                      </pre>
                    )}
                </div>

                {/* CTA */}
                <div className="flex justify-end items-center">
                  <button
                    type="button"
                    onClick={() => router.push(`/dashboard/${projectId}`)}
                    className="bg-white text-black px-5 py-2 rounded-lg font-medium hover:bg-neutral-200 transition cursor-pointer"
                  >
                    Go to Dashboard →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
