"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Bell, CheckCheck, Clock, AlertCircle, Activity, MessageSquare, Settings, Filter } from "lucide-react";

// Dummy notifications data
const DUMMY_NOTIFICATIONS = [
  {
    id: "1",
    title: "New user signup",
    message: "John Doe just signed up for your service",
    timestamp: "2 minutes ago",
    read: false,
    type: "info" as const,
    category: "event" as const,
    date: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: "2",
    title: "Payment received",
    message: "You received a payment of $99.00",
    timestamp: "1 hour ago",
    read: false,
    type: "success" as const,
    category: "event" as const,
    date: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: "3",
    title: "Server alert",
    message: "High CPU usage detected on server-01",
    timestamp: "3 hours ago",
    read: true,
    type: "warning" as const,
    category: "system" as const,
    date: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: "4",
    title: "New feature request",
    message: "User requested dark mode toggle feature",
    timestamp: "5 hours ago",
    read: true,
    type: "info" as const,
    category: "feedback" as const,
    date: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "5",
    title: "Deployment successful",
    message: "Your latest deployment completed successfully",
    timestamp: "1 day ago",
    read: true,
    type: "success" as const,
    category: "system" as const,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "6",
    title: "Error detected",
    message: "Multiple 500 errors detected in the last hour",
    timestamp: "2 days ago",
    read: true,
    type: "error" as const,
    category: "event" as const,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "7",
    title: "New comment on feedback",
    message: "Sarah commented on your feedback item",
    timestamp: "3 days ago",
    read: true,
    type: "info" as const,
    category: "feedback" as const,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "8",
    title: "Subscription renewal",
    message: "Your subscription has been renewed successfully",
    timestamp: "1 week ago",
    read: true,
    type: "success" as const,
    category: "system" as const,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "9",
    title: "User clicked checkout button",
    message: "User john@example.com triggered checkout event on homepage",
    timestamp: "2 hours ago",
    read: false,
    type: "info" as const,
    category: "event" as const,
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "10",
    title: "Negative feedback received",
    message: "User reported issue with the login page",
    timestamp: "4 hours ago",
    read: false,
    type: "warning" as const,
    category: "feedback" as const,
    date: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
];

type FilterType = "all" | "unread" | "info" | "success" | "warning" | "error";
type CategoryFilterType = "all" | "event" | "feedback" | "system";

export default function NotificationsPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
  const [filter, setFilter] = useState<FilterType>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilterType>("all");

  const filteredNotifications = notifications.filter((notification) => {
    // Apply type filter
    let typeMatch = true;
    if (filter === "unread") {
      typeMatch = !notification.read;
    } else if (filter !== "all") {
      typeMatch = notification.type === filter;
    }

    // Apply category filter
    let categoryMatch = true;
    if (categoryFilter !== "all") {
      categoryMatch = notification.category === categoryFilter;
    }

    return typeMatch && categoryMatch;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const eventCount = notifications.filter((n) => n.category === "event").length;
  const feedbackCount = notifications.filter((n) => n.category === "feedback").length;
  const systemCount = notifications.filter((n) => n.category === "system").length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCheck className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "event":
        return <Activity className="h-4 w-4" />;
      case "feedback":
        return <MessageSquare className="h-4 w-4" />;
      case "system":
        return <Settings className="h-4 w-4" />;
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
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 text-sm text-blue-400 hover:text-blue-300 border border-blue-400/30 hover:border-blue-400/50 rounded-lg transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="rounded-lg border border-neutral-800/80 bg-neutral-900/40 backdrop-blur-xl p-4">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-neutral-500" />

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="category-filter" className="text-xs font-medium text-neutral-500 uppercase tracking-wider whitespace-nowrap">
                Category
              </label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as CategoryFilterType)}
                className="rounded-lg border border-neutral-700/60 bg-neutral-800/80 px-3 py-2 text-sm text-neutral-100 focus:border-indigo-500/60 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="event">Events ({eventCount})</option>
                <option value="feedback">Feedback ({feedbackCount})</option>
                <option value="system">System ({systemCount})</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="type-filter" className="text-xs font-medium text-neutral-500 uppercase tracking-wider whitespace-nowrap">
                Type
              </label>
              <select
                id="type-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="rounded-lg border border-neutral-700/60 bg-neutral-800/80 px-3 py-2 text-sm text-neutral-100 focus:border-indigo-500/60 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="unread">Unread {unreadCount > 0 ? `(${unreadCount})` : ""}</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-12 text-center">
            <Bell className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400">No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-neutral-900 border border-neutral-800 rounded-lg p-5 hover:border-neutral-700 transition-all ${
                !notification.read ? "bg-neutral-800/50 border-blue-500/30" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Type Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3
                        className={`text-base font-semibold mb-2 ${
                          !notification.read
                            ? "text-neutral-100"
                            : "text-neutral-300"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-800 border border-neutral-700 rounded-md text-xs text-neutral-300">
                          {getCategoryIcon(notification.category)}
                          <span className="capitalize">{notification.category}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                        <Clock className="h-3.5 w-3.5" />
                        {notification.timestamp}
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-neutral-400 mb-3">
                    {notification.message}
                  </p>
                  {!notification.read && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
