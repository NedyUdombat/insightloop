export default function StateC() {
  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-neutral-400">
          Events are flowing into InsightLoop.
        </p>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Events received"
          value="12"
          delta="↓ 40%"
          deltaType="down"
          hint="Last 24 hours"
          interpretation="Lower than usual traffic. Check ingestion or app activity."
        />

        <StatCard
          label="Feedback items"
          value="3"
          delta="↑ 2"
          deltaType="up"
          hint="Last 7 days"
          interpretation="Users are reporting issues worth reviewing."
        />

        <StatCard
          label="Affected users"
          value="2"
          delta="Stable"
          deltaType="neutral"
          hint="From feedback context"
          interpretation="Issues appear limited in scope."
        />
      </div>

      {/* Primary actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ActionCard
          title="Event timeline"
          description="Inspect the exact sequence of events leading up to issues or feedback."
          href="/events"
        />
        <ActionCard
          title="Feedback"
          description="View user feedback with full behavioral context."
          href="/feedback"
        />
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-neutral-200">
            What needs attention
          </h3>
          <span className="text-xs text-neutral-500">Last 24 hours</span>
        </div>

        <div className="space-y-3">
          <AttentionItem
            title="Feedback submitted after an error"
            description="User reported an issue immediately after a client error."
            badge="Feedback"
            href="/feedback"
            severity="high"
            meta={[
              { label: "after client error", tone: "red" },
              { label: "1 user affected", tone: "neutral" },
            ]}
          />

          <AttentionItem
            title="Repeated validation errors"
            description="Multiple users failed project creation due to validation."
            badge="Events"
            href="/events"
            severity="medium"
            meta={[
              { label: "6 events in 2 min", tone: "amber" },
              { label: "project_name field", tone: "blue" },
            ]}
          />

          <AttentionItem
            title="High-frequency interaction detected"
            description="Users repeatedly clicked the same element in a short window."
            badge="Friction"
            href="/friction"
            severity="low"
            meta={[
              { label: "12 clicks / 8s", tone: "blue" },
              { label: "possible confusion", tone: "green" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function StatCard({
  label,
  value,
  delta,
  deltaType,
  hint,
  interpretation,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaType?: "up" | "down" | "neutral";
  hint: string;
  interpretation: string;
}) {
  const deltaStyles = {
    up: "text-green-400",
    down: "text-red-400",
    neutral: "text-neutral-400",
  };

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-400">{label}</div>

        {delta && (
          <span className={`text-xs ${deltaStyles[deltaType ?? "neutral"]}`}>
            {delta}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="mt-1 text-xl font-semibold">{value}</div>

      {/* Hint */}
      <div className="mt-1 text-xs text-neutral-500">{hint}</div>

      {/* Interpretation */}
      <div className="mt-3 text-xs text-neutral-400">{interpretation}</div>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 hover:bg-neutral-800 transition"
    >
      <h3 className="text-base font-medium">{title}</h3>
      <p className="mt-2 text-sm text-neutral-400">{description}</p>
    </a>
  );
}
function AttentionItem({
  title,
  description,
  badge,
  href,
  severity,
  meta,
}: {
  title: string;
  description: string;
  badge: string;
  href: string;
  severity?: "high" | "medium" | "low";
  meta?: Array<{
    label: string;
    tone: "red" | "amber" | "blue" | "green" | "neutral";
  }>;
}) {
  return (
    <a
      href={href}
      className="
        group
        relative
        block
        rounded-md
        border
        border-neutral-800
        bg-neutral-950
        p-4
        transition
        hover:bg-neutral-800
        focus:bg-neutral-800
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          {/* Title + severity */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-200">
              {title}
            </span>
            {severity && <SeverityPill level={severity} />}
          </div>

          {/* Description */}
          <p className="text-xs text-neutral-400">{description}</p>

          {/* Metadata */}
          {meta && (
            <div className="mt-2 flex flex-wrap gap-2">
              {meta.map((m, i) => (
                <MetaTag key={i} label={m.label} tone={m.tone} />
              ))}
            </div>
          )}
        </div>

        {/* Badge */}
        <span className="rounded-md border border-neutral-700 px-2 py-0.5 text-xs text-neutral-300">
          {badge}
        </span>
      </div>

      {/* Hover microcopy */}
      <span
        className="
          pointer-events-none
          absolute
          bottom-3
          right-4
          text-xs
          text-neutral-500
          opacity-0
          transition-opacity
          group-hover:opacity-100
          group-focus:opacity-100
        "
      >
        View context →
      </span>
    </a>
  );
}

function SeverityPill({ level }: { level: "high" | "medium" | "low" }) {
  const styles = {
    high: "border-red-900 text-red-400 bg-red-950/40",
    medium: "border-amber-900 text-amber-400 bg-amber-950/40",
    low: "border-blue-900 text-blue-400 bg-blue-950/40",
  };

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] ${styles[level]}`}
    >
      {level.toUpperCase()}
    </span>
  );
}
function MetaTag({
  label,
  tone,
}: {
  label: string;
  tone: "red" | "amber" | "blue" | "green" | "neutral";
}) {
  const tones = {
    red: "text-red-400/80",
    amber: "text-amber-400/80",
    blue: "text-blue-400/80",
    green: "text-green-400/80",
    neutral: "text-neutral-500",
  };

  return <span className={`text-xs ${tones[tone]}`}>{label}</span>;
}
