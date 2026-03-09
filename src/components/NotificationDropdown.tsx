"use client";

import { Bell } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Dummy notifications data
const DUMMY_NOTIFICATIONS = [
  {
    id: "1",
    title: "New user signup",
    message: "John Doe just signed up for your service",
    timestamp: "2 minutes ago",
    read: false,
  },
  {
    id: "2",
    title: "Payment received",
    message: "You received a payment of $99.00",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "Server alert",
    message: "High CPU usage detected on server-01",
    timestamp: "3 hours ago",
    read: true,
  },
  {
    id: "4",
    title: "New feature request",
    message: "User requested dark mode toggle feature",
    timestamp: "5 hours ago",
    read: true,
  },
  {
    id: "5",
    title: "Deployment successful",
    message: "Your latest deployment completed successfully",
    timestamp: "1 day ago",
    read: true,
  },
];

export default function NotificationDropdown() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    // This will be implemented with API later
    console.log("Mark all as read");
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
        {/* Unread indicator */}
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full" />
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-100">
              Notifications
            </h3>
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              Mark all as read
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {DUMMY_NOTIFICATIONS.map((notification) => (
              <div
                key={notification.id}
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
                    <p className="text-sm text-neutral-400 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
