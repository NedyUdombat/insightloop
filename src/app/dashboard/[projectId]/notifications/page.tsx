"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  AlertCircle,
  Bell,
  CheckCheck,
  CheckSquare,
  Clock,
  Filter,
  MessageSquare,
  Settings as SettingsIcon,
  Square,
  Trash2,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import type {
  NotificationStatus,
  NotificationType,
} from "@/generated/prisma/enums";
import useDeleteNotifications from "@/queries/notifications/useDeleteNotifications";
import useDeleteReadNotifications from "@/queries/notifications/useDeleteReadNotifications";
import useGetNotifications from "@/queries/notifications/useGetNotifications";
import useMarkAllAsRead from "@/queries/notifications/useMarkAllAsRead";
import useMarkAsRead from "@/queries/notifications/useMarkAsRead";

type FilterType = "all" | "unread";
type CategoryFilterType = "all" | NotificationType;

export default function NotificationsPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [filter, setFilter] = useState<FilterType>("all");
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilterType>("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const limit = 20;

  // Memoize query parameters to prevent unnecessary re-fetches
  const queryFilters = useMemo(() => {
    const filters: any = {
      projectId,
      limit,
      offset: currentPage * limit,
    };

    if (filter === "unread") {
      filters.read = false;
    }

    if (categoryFilter !== "all") {
      filters.type = categoryFilter;
    }

    return filters;
  }, [projectId, filter, categoryFilter, currentPage]);

  const {
    notifications,
    total,
    hasMore,
    isPending: loadingNotifications,
    isError,
  } = useGetNotifications(queryFilters);

  const { markAsRead } = useMarkAsRead();
  const { markAllAsRead, isPending: markingAllAsRead } = useMarkAllAsRead();
  const { deleteNotifications, isPending: deletingNotifications } =
    useDeleteNotifications();
  const { deleteReadNotifications, isPending: deletingRead } =
    useDeleteReadNotifications();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const eventCount = notifications.filter((n) => n.type === "EVENT").length;
  const feedbackCount = notifications.filter(
    (n) => n.type === "FEEDBACK",
  ).length;
  const systemCount = notifications.filter((n) => n.type === "SYSTEM").length;
  const securityCount = notifications.filter(
    (n) => n.type === "SECURITY",
  ).length;

  const hasReadNotifications = notifications.some((n) => n.read);
  const isAllSelected =
    notifications.length > 0 && selectedIds.size === notifications.length;
  const isSomeSelected = selectedIds.size > 0 && !isAllSelected;

  const handleMarkAsRead = (id: string) => {
    markAsRead({ notificationIds: [id] });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead({ projectId });
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotifications({ notificationIds: [id] });
  };

  const handleDeleteAllRead = () => {
    if (
      window.confirm(
        "Are you sure you want to delete all read notifications? This cannot be undone.",
      )
    ) {
      deleteReadNotifications({ projectId });
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(notifications.map((n) => n.id)));
    }
  };

  const handleMarkSelectedAsRead = () => {
    if (selectedIds.size > 0) {
      markAsRead({ notificationIds: Array.from(selectedIds) });
      setSelectedIds(new Set());
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size > 0) {
      if (
        window.confirm(
          `Are you sure you want to delete ${selectedIds.size} notification${selectedIds.size > 1 ? "s" : ""}?`,
        )
      ) {
        deleteNotifications({ notificationIds: Array.from(selectedIds) });
        setSelectedIds(new Set());
      }
    }
  };

  const getTypeIcon = (status: NotificationStatus) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCheck className="h-5 w-5 text-green-500" />;
      case "WARNING":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "ERROR":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCategoryIcon = (type: NotificationType) => {
    switch (type) {
      case "EVENT":
        return <Activity className="h-4 w-4" />;
      case "FEEDBACK":
        return <MessageSquare className="h-4 w-4" />;
      case "SYSTEM":
        return <SettingsIcon className="h-4 w-4" />;
      case "SECURITY":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral-100">
              Notifications
            </h1>
            <p className="text-neutral-400 mt-2">
              {loadingNotifications
                ? "Loading..."
                : total === 0
                  ? "No notifications yet"
                  : unreadCount > 0
                    ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                    : "All caught up!"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hasReadNotifications && (
              <button
                type="button"
                onClick={handleDeleteAllRead}
                disabled={deletingRead}
                className="px-4 py-2 text-sm text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400/50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {deletingRead ? "Deleting..." : "Delete all read"}
              </button>
            )}
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={markingAllAsRead}
                className="px-4 py-2 text-sm text-blue-400 hover:text-blue-300 border border-blue-400/30 hover:border-blue-400/50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {markingAllAsRead ? "Marking..." : "Mark all as read"}
              </button>
            )}
          </div>
        </div>

        {/* Multi-select Actions Bar */}
        {selectedIds.size > 0 && (
          <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-200">
                {selectedIds.size} notification{selectedIds.size > 1 ? "s" : ""}{" "}
                selected
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMarkSelectedAsRead}
                  disabled={deletingNotifications}
                  className="px-3 py-1.5 text-sm text-blue-400 hover:text-blue-300 border border-blue-400/30 hover:border-blue-400/50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  Mark as read
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  disabled={deletingNotifications}
                  className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400/50 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                  className="px-3 py-1.5 text-sm text-neutral-400 hover:text-neutral-200 border border-neutral-700 hover:border-neutral-600 rounded-lg transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="rounded-lg border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-xl p-4">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-neutral-500" />

            {/* Select All Checkbox */}
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleSelectAll}
                className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:text-neutral-100 border border-neutral-700/60 hover:border-neutral-600 rounded-lg transition-colors cursor-pointer"
              >
                {isAllSelected ? (
                  <CheckSquare className="h-4 w-4 text-blue-400" />
                ) : isSomeSelected ? (
                  <CheckSquare className="h-4 w-4 text-blue-400/50" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                <span>Select all</span>
              </button>
            )}

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="category-filter"
                className="text-xs font-medium text-neutral-500 uppercase tracking-wider whitespace-nowrap"
              >
                Category
              </label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value as CategoryFilterType);
                  setCurrentPage(0);
                  setSelectedIds(new Set());
                }}
                className="rounded-lg border border-neutral-700/60 bg-neutral-800/80 px-3 py-2 text-sm text-neutral-100 focus:border-indigo-500/60 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="EVENT">Events ({eventCount})</option>
                <option value="FEEDBACK">Feedback ({feedbackCount})</option>
                <option value="SYSTEM">System ({systemCount})</option>
                <option value="SECURITY">Security ({securityCount})</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="type-filter"
                className="text-xs font-medium text-neutral-500 uppercase tracking-wider whitespace-nowrap"
              >
                Status
              </label>
              <select
                id="type-filter"
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value as FilterType);
                  setCurrentPage(0);
                  setSelectedIds(new Set());
                }}
                className="rounded-lg border border-neutral-700/60 bg-neutral-800/80 px-3 py-2 text-sm text-neutral-100 focus:border-indigo-500/60 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition cursor-pointer"
              >
                <option value="all">All</option>
                <option value="unread">
                  Unread {unreadCount > 0 ? `(${unreadCount})` : ""}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loadingNotifications ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-12 text-center">
            <p className="text-neutral-400">Loading notifications...</p>
          </div>
        ) : isError ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-neutral-400">Failed to load notifications</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-12 text-center">
            <Bell className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">No notifications found</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const isSelected = selectedIds.has(notification.id);
            const isUnread = !notification.read;

            return (
              <div
                key={notification.id}
                className={`rounded-lg p-5 transition-all ${
                  isUnread
                    ? "bg-blue-500/5 border-2 border-blue-500/40 shadow-lg shadow-blue-500/5"
                    : "bg-neutral-900 border border-neutral-800 hover:border-neutral-700"
                } ${isSelected ? "ring-2 ring-blue-400" : ""}`}
              >
                <div className="flex items-start gap-4">
                  {/* Selection Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleToggleSelect(notification.id)}
                    className="flex-shrink-0 mt-1 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                  >
                    {isSelected ? (
                      <CheckSquare className="h-5 w-5 text-blue-400" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>

                  {/* Type Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(notification.status)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3
                          className={`text-base font-semibold mb-2 ${
                            isUnread ? "text-neutral-50" : "text-neutral-400"
                          }`}
                        >
                          {notification.title}
                          {isUnread && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              New
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-800 border border-neutral-700 rounded-md text-xs text-neutral-300">
                            {getCategoryIcon(notification.type)}
                            <span className="capitalize">
                              {notification.type.toLowerCase()}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            },
                          )}
                        </div>
                        {isUnread && (
                          <div className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-pulse" />
                        )}
                      </div>
                    </div>
                    <p
                      className={`text-sm mb-3 ${
                        isUnread ? "text-neutral-300" : "text-neutral-500"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-3">
                      {isUnread && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium cursor-pointer"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                        className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {!loadingNotifications && notifications.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-neutral-400">
            Showing {currentPage * limit + 1} to{" "}
            {Math.min((currentPage + 1) * limit, total)} of {total}{" "}
            notifications
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCurrentPage((p) => Math.max(0, p - 1));
                setSelectedIds(new Set());
              }}
              disabled={currentPage === 0}
              className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 border border-neutral-800 hover:border-neutral-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentPage((p) => p + 1);
                setSelectedIds(new Set());
              }}
              disabled={!hasMore}
              className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 border border-neutral-800 hover:border-neutral-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
