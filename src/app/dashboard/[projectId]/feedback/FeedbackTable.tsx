"use client";

import FeedbackRow from "./FeedbackRow";
import { useFeedback } from "./FeedbackContext";

export default function FeedbackTable() {
  const { feedbacks, isLoading, error, pagination, setPagination } =
    useFeedback();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur p-12">
        <div className="flex items-center justify-center">
          <div className="text-sm text-neutral-400">Loading feedback...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur p-12">
        <div className="flex items-center justify-center">
          <div className="text-sm text-red-400">
            Error loading feedback: {error.message}
          </div>
        </div>
      </div>
    );
  }

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur p-12">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-sm text-neutral-400">No feedback found</div>
          <div className="text-xs text-neutral-500">
            Try adjusting your filters or wait for users to submit feedback
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="rounded-2xl border border-neutral-800/80 bg-gradient-to-br from-neutral-900/80 via-neutral-900/60 to-neutral-900/40 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-neutral-800/80 bg-neutral-950/60">
              <tr className="text-left">
                <th className="px-6 py-4 text-xs font-bold text-neutral-300 uppercase tracking-wider w-8">
                  {/* Expand column */}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-300 uppercase tracking-wider w-32">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  End User
                </th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {feedbacks.map((feedback) => (
                <FeedbackRow key={feedback.id} feedback={feedback} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4">
        <div className="text-sm font-medium text-neutral-300">
          <span className="text-indigo-400 font-semibold">
            Page {pagination.page}
          </span>
          <span className="text-neutral-500 mx-1.5">of</span>
          <span className="text-neutral-400">
            {Math.ceil((pagination.total || 0) / pagination.limit)}
          </span>
          {pagination.total && (
            <>
              <span className="text-neutral-600 mx-2">•</span>
              <span className="text-neutral-400">
                {pagination.total.toLocaleString()}
              </span>
              <span className="text-neutral-500 ml-1">total feedback</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page - 1 })
            }
            disabled={pagination.page === 1}
            className="rounded-lg border border-neutral-700/60 bg-neutral-800/60 px-4 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-700/80 hover:border-neutral-600 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral-800/60"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page + 1 })
            }
            disabled={!pagination.hasMore}
            className="rounded-lg border border-neutral-700/60 bg-neutral-800/60 px-4 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-700/80 hover:border-neutral-600 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral-800/60"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
