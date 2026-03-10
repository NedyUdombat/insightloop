"use client";

import {
  ArrowLeft,
  Bell,
  Mail,
  Smartphone,
  Loader2,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as Toast from "@radix-ui/react-toast";
import { NotificationChannel, DigestFrequency } from "@/generated/prisma/enums";
import { useNotificationLogic } from "./useNotificationLogic";
import useGetCurrentUser from "@/queries/user/useGetCurrentUser";

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useGetCurrentUser();
  const {
    settings,
    setSettings,
    toggleChannel,
    handleEnableAll,
    handleDisableAll,
    handleResetToDefaults,
    handleSave,
    isLoading,
    isUpdating,
    toastOpen,
    setToastOpen,
    toastMessage,
    toastType,
  } = useNotificationLogic();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-10">
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
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 animate-pulse"
              >
                <div className="h-6 bg-neutral-800 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-neutral-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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

        {/* Master Toggle */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-white mb-1">
                Enable Notifications
              </h2>
              <p className="text-sm text-neutral-400">
                Receive notifications across all enabled channels
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.globalNotificationsEnabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    globalNotificationsEnabled: e.target.checked,
                  })
                }
                className="sr-only peer"
                disabled={isUpdating}
              />
              <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-neutral-900 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-disabled:opacity-50"></div>
            </label>
          </div>
        </div>

        {/* Notification Channels */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-white mb-4">
            Notification Channels
          </h2>
          <p className="text-sm text-neutral-400 mb-6">
            Choose which channels to receive notifications through
          </p>
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-300">Email</p>
                  <p className="text-xs text-neutral-500">{user?.email}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.notificationChannels.includes(
                  NotificationChannel.EMAIL,
                )}
                onChange={() => toggleChannel(NotificationChannel.EMAIL)}
                disabled={!settings.globalNotificationsEnabled || isUpdating}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-neutral-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Push */}
            <div className="flex items-center justify-between">
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
              <input
                type="checkbox"
                checked={settings.notificationChannels.includes(
                  NotificationChannel.PUSH,
                )}
                onChange={() => toggleChannel(NotificationChannel.PUSH)}
                disabled={!settings.globalNotificationsEnabled || isUpdating}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-neutral-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* SMS */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-300">SMS</p>
                  <p className="text-xs text-neutral-500">
                    {user?.phone || "No phone number"}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.notificationChannels.includes(
                  NotificationChannel.SMS,
                )}
                onChange={() => toggleChannel(NotificationChannel.SMS)}
                disabled={!settings.globalNotificationsEnabled || isUpdating}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-neutral-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* In-App */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-300">
                    In-App
                  </p>
                  <p className="text-xs text-neutral-500">
                    Notifications within the application
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.notificationChannels.includes(
                  NotificationChannel.IN_APP,
                )}
                onChange={() => toggleChannel(NotificationChannel.IN_APP)}
                disabled={!settings.globalNotificationsEnabled || isUpdating}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-white focus:ring-2 focus:ring-neutral-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-neutral-400" />
            <h2 className="text-lg font-medium text-white">Quiet Hours</h2>
          </div>
          <p className="text-sm text-neutral-400 mb-4">
            Don&apos;t send notifications during these hours
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm text-neutral-400 mb-2 block">
                Start
              </label>
              <input
                type="time"
                value={settings.quietHoursStart || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    quietHoursStart: e.target.value || null,
                  })
                }
                disabled={!settings.globalNotificationsEnabled || isUpdating}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-neutral-400 mb-2 block">End</label>
              <input
                type="time"
                value={settings.quietHoursEnd || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    quietHoursEnd: e.target.value || null,
                  })
                }
                disabled={!settings.globalNotificationsEnabled || isUpdating}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings({
                  ...settings,
                  quietHoursStart: null,
                  quietHoursEnd: null,
                })
              }
              disabled={isUpdating}
              className="mt-6 px-4 py-2 bg-neutral-800 border border-neutral-700 text-neutral-400 rounded-md text-sm hover:bg-neutral-750 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Digest Frequency */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-white mb-2">
            Digest Frequency
          </h2>
          <p className="text-sm text-neutral-400 mb-4">
            How often you&apos;d like to receive grouped notifications
          </p>
          <select
            value={settings.digestFrequency}
            onChange={(e) =>
              setSettings({
                ...settings,
                digestFrequency: e.target.value as DigestFrequency,
              })
            }
            disabled={!settings.globalNotificationsEnabled || isUpdating}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value={DigestFrequency.REAL_TIME}>
              Real-time (immediate notifications)
            </option>
            <option value={DigestFrequency.DAILY}>Daily digest</option>
            <option value={DigestFrequency.WEEKLY}>Weekly digest</option>
          </select>
        </div>

        {/* Quick Actions */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
          <h2 className="text-sm font-medium text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleEnableAll}
              disabled={!settings.globalNotificationsEnabled || isUpdating}
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-md text-sm hover:bg-neutral-750 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enable All Channels
            </button>
            <button
              type="button"
              onClick={handleDisableAll}
              disabled={!settings.globalNotificationsEnabled || isUpdating}
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-md text-sm hover:bg-neutral-750 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Disable All Channels
            </button>
            <button
              type="button"
              onClick={handleResetToDefaults}
              disabled={isUpdating}
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-md text-sm hover:bg-neutral-750 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset to Defaults
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isUpdating}
            className="px-4 py-2 text-neutral-400 text-sm hover:text-neutral-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isUpdating}
            className="px-6 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>

        {/* Toast Notification */}
        <Toast.Provider swipeDirection="right">
          <Toast.Root
            className={`${
              toastType === "success"
                ? "bg-green-900 border-green-700"
                : "bg-red-900 border-red-700"
            } border rounded-lg p-4 shadow-lg`}
            open={toastOpen}
            onOpenChange={setToastOpen}
            duration={3000}
          >
            <Toast.Title className="text-sm font-medium text-white mb-1">
              {toastType === "success" ? "Success" : "Error"}
            </Toast.Title>
            <Toast.Description className="text-sm text-neutral-300">
              {toastMessage}
            </Toast.Description>
          </Toast.Root>
          <Toast.Viewport className="fixed bottom-0 right-0 p-6 flex flex-col gap-2 w-96 max-w-[100vw] z-50" />
        </Toast.Provider>
      </div>
    </div>
  );
}
