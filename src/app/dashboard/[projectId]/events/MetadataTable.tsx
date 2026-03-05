"use client";

import { useState } from "react";
import type { IEvent } from "@/api/types/IEvent";

interface MetadataTableProps {
  event: IEvent;
}

export default function MetadataTable({ event }: MetadataTableProps) {
  const [copiedCell, setCopiedCell] = useState<string | null>(null);

  const handleCopyCell = (key: string, value: any, cellId: string) => {
    const textToCopy = typeof value === "string" ? value : JSON.stringify(value);
    navigator.clipboard.writeText(textToCopy);
    setCopiedCell(cellId);
    setTimeout(() => setCopiedCell(null), 2000);
  };

  const renderValue = (value: any): string => {
    if (value === null || value === undefined) {
      return "null";
    }
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const metadata = event.metadata || {};
  const entries = Object.entries(metadata);

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-800/80 bg-neutral-900/40 px-4 py-8 text-center">
        <p className="text-sm text-neutral-500">No metadata available</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-800/80 bg-neutral-900/40 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-neutral-800/80">
            <th className="px-4 py-2 text-left text-xs font-semibold text-indigo-400 uppercase tracking-wide">
              Key
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-emerald-400 uppercase tracking-wide">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([key, value]) => {
            const keyId = `${key}-key`;
            const valueId = `${key}-value`;

            return (
              <tr
                key={key}
                className="border-b border-neutral-800/80 last:border-b-0 hover:bg-neutral-800/40 transition-all"
              >
                <td className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => handleCopyCell(key, key, keyId)}
                    className="group relative w-full text-left flex items-center justify-between gap-2"
                  >
                    <div className="text-sm font-mono font-medium text-neutral-200 break-all">
                      {key}
                    </div>
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedCell === keyId ? (
                        <svg
                          className="w-4 h-4 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-neutral-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => handleCopyCell(key, value, valueId)}
                    className="group relative w-full text-left flex items-center justify-between gap-2"
                  >
                    <div className="text-sm font-mono text-neutral-300 break-all whitespace-pre-wrap">
                      {renderValue(value)}
                    </div>
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedCell === valueId ? (
                        <svg
                          className="w-4 h-4 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-neutral-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
