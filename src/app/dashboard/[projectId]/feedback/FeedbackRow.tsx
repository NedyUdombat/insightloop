"use client";

import { format } from "date-fns";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PublicFeedback } from "@/api/types/IFeedback";
import type { FeedbackStatus } from "@/generated/prisma/enums";
import { useUpdateFeedbackStatus } from "@/queries/feedback/useUpdateFeedbackStatus";
import EnvironmentPill from "../events/EnvironmentPill";
import { useProject } from "../ProjectContext";
import StatusBadge from "./StatusBadge";

interface FeedbackRowProps {
  feedback: PublicFeedback;
}

export default function FeedbackRow({ feedback }: FeedbackRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { projectId } = useProject();
  const updateStatusMutation = useUpdateFeedbackStatus();
  const rowRef = useRef<HTMLTableRowElement>(null);

  const handleStatusChange = async (newStatus: FeedbackStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        projectId,
        feedbackId: feedback.id,
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update feedback status:", error);
    }
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

  const rating = feedback.rating;
  const renderRating = () => {
    if (!rating) return <span className="text-neutral-500">N/A</span>;
    return (
      <div className="flex items-center gap-1">
        <span className="text-yellow-400">{"★".repeat(rating)}</span>
        <span className="text-neutral-600">{"★".repeat(5 - rating)}</span>
      </div>
    );
  };

  return (
    <>
      <tr
        ref={rowRef}
        tabIndex={0}
        className="hover:bg-neutral-800/30 transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={handleKeyDown}
      >
        {/* Expand Icon */}
        <td className="px-4 py-4">
          <div className="flex items-center text-neutral-500 group-hover:text-indigo-400 transition-all transform group-hover:scale-110">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        </td>

        {/* Status */}
        <td className="px-6 py-4">
          <div className="flex items-center">
            <StatusBadge
              status={feedback.status}
              onChange={handleStatusChange}
              isLoading={updateStatusMutation.isPending}
            />
          </div>
        </td>

        {/* Message Preview */}
        <td className="px-6 py-4">
          <div className="text-sm text-neutral-200 truncate max-w-[250px]">
            {feedback.message}
          </div>
        </td>

        {/* End User */}
        <td className="px-6 py-4">
          <div className="text-sm font-medium text-neutral-300">
            {feedback.endUser?.email ||
              feedback.endUser?.name ||
              feedback.endUserId || <span className="text-neutral-500">—</span>}
          </div>
        </td>

        {/* Rating */}
        <td className="px-6 py-4">{renderRating()}</td>

        {/* Timestamp */}
        <td className="px-2 py-4">
          <div className="text-sm text-neutral-400">
            {format(
              new Date(feedback.feedbackTimestamp || feedback.createdAt),
              "dd/MM/YYY h:mm a",
            )}
          </div>
        </td>
      </tr>

      {/* Expanded Details */}
      {isExpanded && (
        <tr className="bg-neutral-950/80 border-t border-neutral-800/60">
          <td colSpan={6} className="px-6 py-6">
            <div className="space-y-8 max-h-[600px] overflow-y-auto scrollbar-thin accordion-content">
              {/* Title Section */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                  <h4 className="text-sm font-bold text-neutral-100 uppercase tracking-wide">
                    Title
                  </h4>
                  <div className="flex-1 h-px bg-gradient-to-r from-neutral-800 via-transparent to-transparent" />
                </div>
                <div className="rounded-lg border border-neutral-800/60 bg-neutral-900/40 p-4">
                  <p className="text-base font-semibold text-neutral-100">
                    {feedback.title || (
                      <span className="text-neutral-500 italic">
                        No title provided
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Message Section */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                  <h4 className="text-sm font-bold text-neutral-100 uppercase tracking-wide">
                    Message
                  </h4>
                  <div className="flex-1 h-px bg-gradient-to-r from-neutral-800 via-transparent to-transparent" />
                </div>
                <div className="rounded-lg border border-neutral-800/60 bg-neutral-900/40 p-4">
                  <p className="text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed">
                    {feedback.message}
                  </p>
                </div>
              </div>

              {/* Additional Info Section */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-1 h-5 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full" />
                  <h4 className="text-sm font-bold text-neutral-100 uppercase tracking-wide">
                    Additional Information
                  </h4>
                  <div className="flex-1 h-px bg-gradient-to-r from-neutral-800 via-transparent to-transparent" />
                </div>
                <div className="rounded-lg border border-neutral-800/60 bg-neutral-900/40 p-4">
                  <p className="text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed">
                    {feedback.additionalInfo || (
                      <span className="text-neutral-500 italic">
                        No additional information provided
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* User Info Section */}
              {feedback.endUser && (
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
                      {feedback.endUser.name && (
                        <div>
                          <span className="text-neutral-500">Name:</span>
                          <span className="ml-2 text-neutral-200">
                            {feedback.endUser.name}
                          </span>
                        </div>
                      )}
                      {feedback.endUser.email && (
                        <div>
                          <span className="text-neutral-500">Email:</span>
                          <span className="ml-2 text-neutral-200">
                            {feedback.endUser.email}
                          </span>
                        </div>
                      )}
                      {feedback.endUser.externalUserId && (
                        <div className="col-span-2">
                          <span className="text-neutral-500">
                            External User ID:
                          </span>
                          <span className="ml-2 text-neutral-200 font-mono text-xs">
                            {feedback.endUser.externalUserId}
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
                        <EnvironmentPill environment={feedback.environment} />
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Rating:</span>
                      <span className="ml-2">{renderRating()}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Created At:</span>
                      <span className="ml-2 text-neutral-200 font-mono text-xs">
                        {format(
                          new Date(feedback.createdAt),
                          "MMM d, yyyy h:mm:ss a",
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Updated At:</span>
                      <span className="ml-2 text-neutral-200 font-mono text-xs">
                        {format(
                          new Date(feedback.updatedAt),
                          "MMM d, yyyy h:mm:ss a",
                        )}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-neutral-500">Feedback ID:</span>
                      <span className="ml-2 text-neutral-200 font-mono text-xs">
                        {feedback.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Properties Section */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-1 h-5 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                  <h4 className="text-sm font-bold text-neutral-100 uppercase tracking-wide">
                    Properties
                  </h4>
                  <div className="flex-1 h-px bg-gradient-to-r from-neutral-800 via-transparent to-transparent" />
                </div>
                {feedback.properties &&
                Object.keys(feedback.properties).length > 0 ? (
                  <div className="rounded-lg border border-neutral-800/60 bg-neutral-900/40 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-neutral-800/60">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-900/60">
                              Key
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-900/60">
                              Value
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/40">
                          {Object.entries(feedback.properties).map(
                            ([key, value]) => (
                              <tr
                                key={key}
                                className="hover:bg-neutral-800/20 transition"
                              >
                                <td className="px-4 py-3 font-mono text-xs text-indigo-300">
                                  {key}
                                </td>
                                <td className="px-4 py-3 text-neutral-200 font-mono text-xs break-all">
                                  {typeof value === "object"
                                    ? JSON.stringify(value, null, 2)
                                    : String(value)}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-neutral-800/60 bg-neutral-900/40 p-4">
                    <p className="text-sm text-neutral-500 italic">
                      No properties provided
                    </p>
                  </div>
                )}
              </div>

              {/* Metadata Section (if exists) */}
              {feedback.metadata &&
                Object.keys(feedback.metadata).length > 0 && (
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-1 h-5 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
                      <h4 className="text-sm font-bold text-neutral-100 uppercase tracking-wide">
                        Metadata
                      </h4>
                      <div className="flex-1 h-px bg-gradient-to-r from-neutral-800 via-transparent to-transparent" />
                    </div>
                    <div className="rounded-lg border border-neutral-800/60 bg-neutral-900/40 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-neutral-800/60">
                              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-900/60">
                                Key
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-900/60">
                                Value
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-800/40">
                            {Object.entries(feedback.metadata).map(
                              ([key, value]) => (
                                <tr
                                  key={key}
                                  className="hover:bg-neutral-800/20 transition"
                                >
                                  <td className="px-4 py-3 font-mono text-xs text-cyan-300">
                                    {key}
                                  </td>
                                  <td className="px-4 py-3 text-neutral-200 font-mono text-xs break-all">
                                    {typeof value === "object"
                                      ? JSON.stringify(value, null, 2)
                                      : String(value)}
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
