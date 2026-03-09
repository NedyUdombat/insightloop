"use client";

import { ArrowLeft, Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface NotificationCategory {
  category: string;
  icon: typeof Bell;
  settings: NotificationSetting[];
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notificationSettings, setNotificationSettings] = useState<
    NotificationCategory[]
  >([
    {
      category: "Account Activity",
      icon: Bell,
      settings: [
        {
          id: "login",
          title: "Login notifications",
          description: "Get notified when a new device logs into your account",
          email: true,
          push: true,
          sms: false,
        },
        {
          id: "password",
          title: "Password changes",
          description: "Alerts when your password is changed",
          email: true,
          push: true,
          sms: true,
        },
        {
          id: "security",
          title: "Security alerts",
          description: "Important security updates and suspicious activity",
          email: true,
          push: true,
          sms: true,
        },
      ],
    },
    {
      category: "Project Updates",
      icon: MessageSquare,
      settings: [
        {
          id: "events",
          title: "New events",
          description: "Notifications when new events are logged",
          email: true,
          push: false,
          sms: false,
        },
        {
          id: "errors",
          title: "Error alerts",
          description: "Get notified about critical errors in your projects",
          email: true,
          push: true,
          sms: false,
        },
        {
          id: "feedback",
          title: "User feedback",
          description: "Notifications when users submit feedback",
          email: true,
          push: true,
          sms: false,
        },
      ],
    },
    {
      category: "Billing & Usage",
      icon: Mail,
      settings: [
        {
          id: "invoices",
          title: "Invoices and receipts",
          description: "Monthly invoices and payment confirmations",
          email: true,
          push: false,
          sms: false,
        },
        {
          id: "usage",
          title: "Usage alerts",
          description: "Notifications when approaching usage limits",
          email: true,
          push: true,
          sms: false,
        },
        {
          id: "subscription",
          title: "Subscription updates",
          description: "Changes to your subscription and billing",
          email: true,
          push: false,
          sms: false,
        },
      ],
    },
    {
      category: "Product Updates",
      icon: Smartphone,
      settings: [
        {
          id: "features",
          title: "New features",
          description: "Learn about new features and improvements",
          email: false,
          push: false,
          sms: false,
        },
        {
          id: "newsletter",
          title: "Weekly newsletter",
          description: "Tips, best practices, and product updates",
          email: false,
          push: false,
          sms: false,
        },
        {
          id: "maintenance",
          title: "Maintenance notifications",
          description: "Scheduled maintenance and downtime alerts",
          email: true,
          push: true,
          sms: false,
        },
      ],
    },
  ]);

  const handleToggle = (
    categoryIndex: number,
    settingIndex: number,
    channel: "email" | "push" | "sms",
  ) => {
    setNotificationSettings((prev) => {
      const updated = [...prev];
      updated[categoryIndex].settings[settingIndex][channel] =
        !updated[categoryIndex].settings[settingIndex][channel];
      return updated;
    });
  };

  const handleSaveChanges = () => {
    console.log("Saving notification settings:", notificationSettings);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-neutral-400 hover:text-neutral-300 transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-3xl font-semibold text-white mb-2">
            Notification Settings
          </h1>
          <p className="text-neutral-400">
            Choose how you want to be notified about activity
          </p>
        </div>

        {/* Notification Channels Legend */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
          <h2 className="text-sm font-medium text-white mb-4">
            Notification Channels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-neutral-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-300">Email</p>
                <p className="text-xs text-neutral-500">john@example.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-neutral-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-300">Push</p>
                <p className="text-xs text-neutral-500">
                  Browser notifications
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-neutral-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-300">SMS</p>
                <p className="text-xs text-neutral-500">+1 (555) 000-0000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings by Category */}
        <div className="space-y-6">
          {notificationSettings.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <div
                key={category.category}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-neutral-400" />
                  </div>
                  <h2 className="text-lg font-medium text-white">
                    {category.category}
                  </h2>
                </div>

                <div className="space-y-4">
                  {category.settings.map((setting, settingIndex) => (
                    <div
                      key={setting.id}
                      className="border-b border-neutral-800 last:border-0 pb-4 last:pb-0"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-200 mb-1">
                            {setting.title}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {setting.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-6 ml-0">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.email}
                            onChange={() =>
                              handleToggle(categoryIndex, settingIndex, "email")
                            }
                            className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-neutral-600 cursor-pointer"
                          />
                          <span className="text-sm text-neutral-400">
                            Email
                          </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.push}
                            onChange={() =>
                              handleToggle(categoryIndex, settingIndex, "push")
                            }
                            className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-neutral-600 cursor-pointer"
                          />
                          <span className="text-sm text-neutral-400">Push</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.sms}
                            onChange={() =>
                              handleToggle(categoryIndex, settingIndex, "sms")
                            }
                            className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-neutral-600 cursor-pointer"
                          />
                          <span className="text-sm text-neutral-400">SMS</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mt-6">
          <h2 className="text-sm font-medium text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-md text-sm hover:bg-neutral-750 transition-colors cursor-pointer"
            >
              Enable All Email
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-md text-sm hover:bg-neutral-750 transition-colors cursor-pointer"
            >
              Disable All Push
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-md text-sm hover:bg-neutral-750 transition-colors cursor-pointer"
            >
              Reset to Defaults
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="px-4 py-2 text-neutral-400 text-sm hover:text-neutral-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveChanges}
            className="px-6 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
