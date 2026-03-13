"use client";

import type { PublicEndUser } from "@/queries/endusers/type";

interface EndUserRowProps {
  endUser: PublicEndUser;
}

export default function EndUserRow({ endUser }: EndUserRowProps) {
  const fullName = [endUser.firstName, endUser.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  const displayName = fullName || "—";
  const displayEmail = endUser.email || "—";
  const displayUserId = endUser.externalUserId || endUser.anonymousId;

  return (
    <tr className="hover:bg-neutral-800/30 transition-colors">
      <td className="px-6 py-4 text-sm text-neutral-200 font-mono">
        {displayUserId}
      </td>
      <td className="px-6 py-4 text-sm text-neutral-200">{displayName}</td>
      <td className="px-6 py-4 text-sm text-neutral-300">{displayEmail}</td>
      <td className="px-6 py-4 text-sm text-neutral-400">
        {new Date(endUser.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>
    </tr>
  );
}
