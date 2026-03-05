"use client";

import type { PublicEvent } from "@/api/types/IEvent";
import { useEffect, useRef, useState } from "react";
import EnvironmentPill from "./EnvironmentPill";
import MetadataTable from "./MetadataTable";
import PropertiesTable from "./PropertiesTable";

interface EventRowProps {
  event: PublicEvent;
}

export default function EventRow({ event }: EventRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const rowRef = useRef<HTMLTableRowElement>(null);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" && !isExpanded) {
      setIsExpanded(true);
    } else if (e.key === "ArrowLeft" && isExpanded) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    if (rowRef.current && document.activeElement === rowRef.current) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight" && !isExpanded) {
          setIsExpanded(true);
        } else if (e.key === "ArrowLeft" && isExpanded) {
          setIsExpanded(false);
        }
      };
      rowRef.current.addEventListener("keydown", handleKeyPress);
      return () =>
        rowRef.current?.removeEventListener("keydown", handleKeyPress);
    }
  }, [isExpanded]);

  return (
    <>
      <tr
        ref={rowRef}
        tabIndex={0}
        className="hover:bg-neutral-800/30 transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={handleKeyDown}
      >
        <td className="px-4 py-4">
          <div className="flex items-center text-neutral-500 group-hover:text-indigo-400 transition-all transform group-hover:scale-110">
            {isExpanded ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                alt="sew"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ) : (
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
            )}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm font-semibold text-neutral-100 group-hover:text-indigo-300 transition-colors">
            {event.eventName}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm font-medium text-neutral-300">
            {event.endUser?.email ||
              event.endUser?.name ||
              event.endUser?.externalUserId ||
              event.endUserId || <span className="text-neutral-500">—</span>}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-neutral-400 font-mono">
            {formatDate(event.eventTimestamp)}
          </div>
        </td>
        <td className="px-6 py-4">
          <EnvironmentPill environment={event.environment} />
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-neutral-950/80 border-t border-neutral-800/60">
          <td colSpan={5} className="px-6 py-6">
            <div className="space-y-8 max-h-[600px] overflow-y-auto scrollbar-thin accordion-content">
              {/* User Info Section */}
              {event.endUser && (
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
                    <h4 className="text-sm font-bold text-neutral-100 uppercase tracking-wide">
                      User Information
                    </h4>
                    <div className="flex-1 h-px bg-gradient-to-r from-neutral-800 via-transparent to-transparent" />
                  </div>
                  <div className="rounded-lg border border-neutral-800/60 bg-neutral-900/40 p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {event.endUser.name && (
                        <div>
                          <span className="text-neutral-500">Name:</span>
                          <span className="ml-2 text-neutral-200">
                            {event.endUser.name}
                          </span>
                        </div>
                      )}
                      {event.endUser.email && (
                        <div>
                          <span className="text-neutral-500">Email:</span>
                          <span className="ml-2 text-neutral-200">
                            {event.endUser.email}
                          </span>
                        </div>
                      )}
                      {event.endUser.externalUserId && (
                        <div className="col-span-2">
                          <span className="text-neutral-500">
                            External User ID:
                          </span>
                          <span className="ml-2 text-neutral-200 font-mono text-xs">
                            {event.endUser.externalUserId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* System Information */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-1 h-5 bg-gradient-to-b from-slate-500 to-gray-500 rounded-full" />
                  <h4 className="text-sm font-bold text-neutral-100 uppercase tracking-wide">
                    System Information
                  </h4>
                  <div className="flex-1 h-px bg-gradient-to-r from-neutral-800 via-transparent to-transparent" />
                </div>
                <div className="rounded-lg border border-neutral-800/60 bg-neutral-900/40 p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-500">Environment:</span>
                      <span className="ml-2">
                        <EnvironmentPill environment={event.environment} />
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Event Name:</span>
                      <span className="ml-2 text-neutral-200 font-mono text-xs">
                        {event.eventName}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Event Timestamp:</span>
                      <span className="ml-2 text-neutral-200 font-mono text-xs">
                        {formatDate(event.eventTimestamp)}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Created At:</span>
                      <span className="ml-2 text-neutral-200 font-mono text-xs">
                        {formatDate(event.createdAt)}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-neutral-500">Event ID:</span>
                      <span className="ml-2 text-neutral-200 font-mono text-xs">
                        {event.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Properties Section */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                  <h4 className="text-sm font-bold text-neutral-100 uppercase tracking-wide">
                    Properties
                  </h4>
                  <div className="flex-1 h-px bg-gradient-to-r from-neutral-800 via-transparent to-transparent" />
                </div>
                <PropertiesTable event={event} />
              </div>

              {/* Metadata Section */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-1 h-5 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
                  <h4 className="text-sm font-bold text-neutral-100 uppercase tracking-wide">
                    Metadata
                  </h4>
                  <div className="flex-1 h-px bg-gradient-to-r from-neutral-800 via-transparent to-transparent" />
                </div>
                <MetadataTable event={event} />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
