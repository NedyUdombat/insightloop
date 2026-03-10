"use client";

import { Bell } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import useGetNotifications from "@/queries/notifications/useGetNotifications";
import useGetUnreadCount from "@/queries/notifications/useGetUnreadCount";
import useMarkAllAsRead from "@/queries/notifications/useMarkAllAsRead";
import useMarkAsRead from "@/queries/notifications/useMarkAsRead";

export default function NotificationDropdown() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Memoize query parameters to prevent infinite re-fetches
  const queryParams = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return {
      projectId,
      startDate: yesterday.toISOString(),
      endDate: new Date().toISOString(),
      limit: 10,
    };
  }, [projectId]);

  const { notifications, isPending: loadingNotifications } =
    useGetNotifications(queryParams);

  const { count: unreadCount } = useGetUnreadCount(projectId);
  const { markAllAsRead, isPending: markingAllAsRead } = useMarkAllAsRead();
  const { markAsRead } = useMarkAsRead();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const handleMarkAllAsRead = () => {
    markAllAsRead({ projectId });
  };

  const handleNotificationClick = (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead({ notificationIds: [notificationId] });
    }
  };

  const handleViewAll = () => {
    setShowNotifications(false);
    router.push(`/dashboard/${projectId}/notifications`);
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        type="button"
        onClick={() => setShowNotifications(!showNotifications)}
        className="text-neutral-400 hover:text-neutral-200 transition-colors relative cursor-pointer"
      >
        <Bell className="h-5 w-5" />
        {/* Unread count badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 bg-blue-500 text-white text-xs font-semibold rounded-full border-2 border-neutral-950">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-100">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={markingAllAsRead}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer disabled:opacity-50"
              >
                {markingAllAsRead ? "Marking..." : "Mark all as read"}
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loadingNotifications ? (
              <div className="px-4 py-8 text-center text-neutral-400 text-sm">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-neutral-400 text-sm">
                No recent notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() =>
                    handleNotificationClick(notification.id, notification.read)
                  }
                  className={`px-4 py-3 border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors cursor-pointer ${
                    !notification.read ? "bg-neutral-800/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                        !notification.read ? "bg-blue-500" : "bg-transparent"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-100 truncate">
                        {notification.title}
                      </p>
                      <p className="text-sm text-neutral-400 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={handleViewAll}
              className="w-full text-sm text-blue-400 hover:text-blue-300 transition-colors text-center cursor-pointer"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
