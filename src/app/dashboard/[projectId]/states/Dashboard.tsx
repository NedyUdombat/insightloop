import { formatDistanceToNow } from "date-fns";
import EnvironmentPill from "../events/EnvironmentPill";
import { useProject } from "../ProjectContext";

export default function Dashboard() {
  const { project, recentEvents, isRecentEventsPending } = useProject();
  const projectName = project?.name || "Project";
  const totalEvents = project?.eventsCount || 0;
  const totalFeedback = project?.feedbackCount || 0;

  // Get the most recent event timestamp
  const lastEventTime =
    recentEvents.length > 0
      ? formatDistanceToNow(new Date(recentEvents[0].eventTimestamp), {
          addSuffix: true,
        })
      : "—";

  console.log({ project, recentEvents });

  // Show loader while recent events are loading
  if (isRecentEventsPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-neutral-800 border-t-indigo-500 rounded-full animate-spin" />
          {/* Optional glow effect */}
          <div className="absolute inset-0 w-16 h-16 bg-indigo-600/20 blur-xl rounded-full" />
          <p className="mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header with Live Badge */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">
                {projectName}
              </h1>
              <span className="rounded-full border border-indigo-800 bg-indigo-950/40 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
                Live
              </span>
            </div>
            <p className="mt-2 text-sm text-neutral-400">
              Events are flowing into InsightLoop.
            </p>
          </div>

          {/* Quick Actions - Top Right */}
          <div className="flex gap-2">
            <a
              href={`/dashboard/${project?.id}/events`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
            >
              View Events
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
            <a
              href={`/dashboard/${project?.id}/feedback`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800/50 px-4 py-2 text-sm font-medium hover:bg-neutral-800 hover:border-neutral-600 transition-all"
            >
              Feedback
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <AccentStat label="Total events" value={totalEvents} />
          <AccentStat label="Feedback" value={totalFeedback} />
          <AccentStat label="Last event" value={lastEventTime} />
        </div>

        {/* Accent Divider */}
        <div className="h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/40 to-indigo-500/0" />

        {/* Recent Events Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-200">
              Recent Activity
            </h2>
            <a
              href={`/dashboard/${project?.id}/events`}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View all events →
            </a>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur overflow-hidden">
            {recentEvents.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-neutral-500">No events yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-800">
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between gap-4 p-4 hover:bg-neutral-800/40 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-neutral-100">
                        {event.eventName}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-neutral-500">
                        <EnvironmentPill environment={event.environment} />
                        <span>•</span>
                        <span className="font-mono truncate">
                          {truncateEndUserId(event.endUserId)}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-400 whitespace-nowrap">
                      {formatDistanceToNow(new Date(event.eventTimestamp), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function truncateEndUserId(endUserId: string): string {
  if (endUserId.length <= 6) {
    return endUserId;
  }
  return `${endUserId.slice(0, 2)}...${endUserId.slice(-4)}`;
}

function AccentStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div
      className="
      rounded-xl
      border
      border-neutral-800
      bg-gradient-to-br
      from-neutral-900
      to-neutral-950
      p-6
      relative
      overflow-hidden
      hover:border-neutral-700
      transition-colors
    "
    >
      {/* Accent Glow */}
      <div className="absolute top-0 right-0 h-20 w-20 bg-indigo-600/8 blur-2xl rounded-full" />

      <div className="relative">
        <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
          {label}
        </div>
        <div className="mt-3 text-2xl font-semibold tracking-tight text-neutral-100">
          {value}
        </div>
      </div>
    </div>
  );
}
