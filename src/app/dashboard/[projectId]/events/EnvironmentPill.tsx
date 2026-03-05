"use client";

import type { Environment } from "@/generated/prisma/enums";

interface EnvironmentPillProps {
  environment: Environment;
}

export default function EnvironmentPill({ environment }: EnvironmentPillProps) {
  const styles = {
    PRODUCTION:
      "bg-emerald-950/40 border border-emerald-800/50 text-emerald-200 shadow-[0_0_5px_rgba(16,185,129,0.09)]",
    STAGING:
      "bg-amber-950/40 border border-amber-800/50 text-amber-200 shadow-[0_0_5px_rgba(245,158,11,0.09)]",
    DEVELOPMENT:
      "bg-indigo-950/40 border border-indigo-800/50 text-indigo-200 shadow-[0_0_5px_rgba(99,102,241,0.09)]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${styles[environment]}`}
    >
      {environment}
    </span>
  );
}
