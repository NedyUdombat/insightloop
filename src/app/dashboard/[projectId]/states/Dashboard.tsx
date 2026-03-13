import { formatDistanceToNow } from "date-fns";
import { ChevronRight, MessageSquare, Zap } from "lucide-react";
import { Environment } from "@/generated/prisma/enums";
import EnvironmentPill from "../events/EnvironmentPill";
import { useProject } from "../ProjectContext";

export default function Dashboard() {
  const { project, recentActivity, isRecentActivityPending } = useProject();
  const projectName = project?.name || "Project";
  const totalEvents = project?.eventsCount || 0;
  const totalFeedback = project?.feedbackCount || 0;

  // Get the most recent activity timestamp
  const lastActivityTime =
    recentActivity.length > 0
      ? formatDistanceToNow(new Date(recentActivity[0].timestamp), {
          addSuffix: true,
        })
      : "—";

  // Show loader while recent activity is loading
  if (isRecentActivityPending) {
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
    <div className="flex justify-center px-4">
      <div className="w-full max-w-7xl space-y-6">
        {/* Header with Live Badge */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">
                {projectName}
              </h1>
              {project?.defaultEnvironment &&
                project.defaultEnvironment === Environment.PRODUCTION && (
                  <span className="rounded-full border border-indigo-800 bg-indigo-950/40 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
                    Live
                  </span>
                )}
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
              <ChevronRight className="w-4 h-4" />
            </a>
            <a
              href={`/dashboard/${project?.id}/feedback`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800/50 px-4 py-2 text-sm font-medium hover:bg-neutral-800 hover:border-neutral-600 transition-all"
            >
              Feedback
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <AccentStat label="Total events" value={totalEvents} />
          <AccentStat label="Feedback" value={totalFeedback} />
          <AccentStat label="Last activity" value={lastActivityTime} />
        </div>

        {/* Accent Divider */}
        <div className="h-px bg-linear-to-r from-indigo-500/0 via-indigo-500/40 to-indigo-500/0" />

        {/* Recent Events Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-200">
              Recent Activity
            </h2>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur overflow-hidden">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-neutral-500">No activity yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-800">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start justify-between gap-4 p-4 hover:bg-neutral-800/40 transition-colors"
                  >
                    <div className="flex gap-3 flex-1 min-w-0">
                      {/* Icon */}
                      <div className="shrink-0 mt-0.5">
                        {activity.type === "event" ? (
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-indigo-400" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-amber-400" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                            {activity.type}
                          </span>
                          <EnvironmentPill environment={activity.environment} />
                        </div>
                        <div className="text-sm font-medium text-neutral-100 mb-1">
                          {activity.type === "event"
                            ? activity.eventName
                            : activity.message}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <span className="font-mono truncate">
                            {truncateEndUserId(activity.endUserId || "unknown")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <span className="text-xs text-neutral-400 whitespace-nowrap shrink-0">
                      {formatDistanceToNow(new Date(activity.timestamp), {
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
      bg-linear-to-br
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
