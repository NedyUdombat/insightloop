"use client";

import * as Toast from "@radix-ui/react-toast";
import { AlertTriangle, Save, Trash2 } from "lucide-react";
import useProjectSettingsLogic from "./logic";

export default function ProjectSettingsPage() {
  const {
    project,
    projectId,
    projectName,
    setProjectName,
    showDeleteConfirm,
    setShowDeleteConfirm,
    deleteConfirmText,
    setDeleteConfirmText,
    error,
    setError,
    preferences,
    setPreferences,
    toastOpen,
    setToastOpen,
    toastMessage,
    toastType,
    handleUpdateProject,
    handleDeleteProject,
    isUpdating,
    isDeleting,
  } = useProjectSettingsLogic();

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-neutral-800 border-t-indigo-500 rounded-full animate-spin" />
          {/* Optional glow effect */}
          <div className="absolute inset-0 w-16 h-16 bg-indigo-600/20 blur-xl rounded-full" />
          <p className="mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center px-4">
        <div className="w-full max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Project Settings
              </h1>
              <p className="mt-1 text-sm text-neutral-400">
                Manage your project configuration and preferences
              </p>
            </div>
          </div>

          {/* Accent Divider */}
          <div className="h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/40 to-indigo-500/0" />

          {/* Error Messages */}
          {error && (
            <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* General Settings */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium text-neutral-200">
                General Settings
              </h2>
              <p className="mt-1 text-sm text-neutral-400">
                Basic project information
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="projectName"
                  className="block text-sm font-medium text-neutral-300 mb-2"
                >
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter project name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-400">Project ID:</span>
                  <p className="mt-1 font-mono text-xs text-neutral-300">
                    {projectId}
                  </p>
                </div>
                <div>
                  <span className="text-neutral-400">Created:</span>
                  <p className="mt-1 text-neutral-300">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium text-neutral-200">
                Preferences
              </h2>
              <p className="mt-1 text-sm text-neutral-400">
                Configure project notifications and behavior
              </p>
            </div>

            <div className="space-y-4">
              {/* Notifications Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-300">
                  Notifications
                </h3>

                <ToggleSwitch
                  label="Email Notifications"
                  description="Receive email updates about project events"
                  checked={preferences.emailNotifications}
                  onChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      emailNotifications: checked,
                    })
                  }
                />

                <ToggleSwitch
                  label="Event Alerts"
                  description="Get notified when new events are captured"
                  checked={preferences.eventAlerts}
                  onChange={(checked) =>
                    setPreferences({ ...preferences, eventAlerts: checked })
                  }
                />

                <ToggleSwitch
                  label="Weekly Reports"
                  description="Receive weekly summary of project activity"
                  checked={preferences.weeklyReports}
                  onChange={(checked) =>
                    setPreferences({ ...preferences, weeklyReports: checked })
                  }
                />
              </div>

              {/* Data Management Section */}
              <div className="pt-4 border-t border-neutral-800 space-y-3">
                <h3 className="text-sm font-medium text-neutral-300">
                  Data Management
                </h3>

                <ToggleSwitch
                  label="Auto Archive"
                  description="Automatically archive old events"
                  checked={preferences.autoArchive}
                  onChange={(checked) =>
                    setPreferences({ ...preferences, autoArchive: checked })
                  }
                />

                <div>
                  <label
                    htmlFor="retentionDays"
                    className="block text-sm font-medium text-neutral-300 mb-2"
                  >
                    Event Retention Period (days)
                  </label>
                  <select
                    id="retentionDays"
                    value={preferences.retentionDays}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        retentionDays: parseInt(e.target.value),
                      })
                    }
                    className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-neutral-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value={7}>7 days</option>
                    <option value={14}>14 days</option>
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                    <option value={180}>180 days</option>
                    <option value={365}>1 year</option>
                  </select>
                </div>
              </div>

              {/* Environment Section */}
              <div className="pt-4 border-t border-neutral-800 space-y-3">
                <h3 className="text-sm font-medium text-neutral-300">
                  Environment
                </h3>

                <div>
                  <label
                    htmlFor="defaultEnvironment"
                    className="block text-sm font-medium text-neutral-300 mb-2"
                  >
                    Default Environment
                  </label>
                  <p className="text-xs text-neutral-500 mb-2">
                    Set the default environment for viewing events and feedback
                  </p>
                  <select
                    id="defaultEnvironment"
                    value={preferences.defaultEnvironment}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        defaultEnvironment: e.target.value as any,
                      })
                    }
                    className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-neutral-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="PRODUCTION">Production</option>
                    <option value="STAGING">Staging</option>
                    <option value="DEVELOPMENT">Development</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUpdateProject}
              disabled={isUpdating}
              className="flex cursor-pointer items-center gap-2 rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-medium hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl border border-red-900/50 bg-red-950/20 backdrop-blur p-6 space-y-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-400 mt-0.5" size={20} />
              <div>
                <h2 className="text-lg font-medium text-red-400">
                  Danger Zone
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                  Irreversible and destructive actions
                </p>
              </div>
            </div>

            {!showDeleteConfirm ? (
              <div className="flex items-center justify-between pt-4 border-t border-red-900/30">
                <div>
                  <h3 className="text-sm font-medium text-neutral-200">
                    Delete Project
                  </h3>
                  <p className="mt-1 text-sm text-neutral-400">
                    Permanently delete this project and all associated data
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-red-800 bg-red-950/40 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/40 transition"
                >
                  <Trash2 size={16} />
                  Delete Project
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-red-900/30 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-red-400 mb-2">
                    Confirm Deletion
                  </h3>
                  <p className="text-sm text-neutral-400 mb-4">
                    This action cannot be undone. Type{" "}
                    <span className="font-mono font-semibold text-neutral-200">
                      {project.name}
                    </span>{" "}
                    to confirm.
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full rounded-md border border-red-800 bg-red-950/40 px-4 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="Type project name to confirm"
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText("");
                      setError(null);
                    }}
                    disabled={isDeleting}
                    className="rounded-md cursor-pointer border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteProject}
                    disabled={isDeleting || deleteConfirmText !== project.name}
                    className="flex cursor-pointer items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                    {isDeleting ? "Deleting..." : "Delete Permanently"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast.Root
        className={`rounded-lg border px-4 py-3 shadow-lg ${
          toastType === "success"
            ? "border-green-800 bg-green-950/90 text-green-400"
            : "border-red-800 bg-red-950/90 text-red-400"
        }`}
        open={toastOpen}
        onOpenChange={setToastOpen}
        duration={3000}
      >
        <Toast.Description className="text-sm font-medium">
          {toastMessage}
        </Toast.Description>
      </Toast.Root>
    </>
  );
}

// Toggle Switch Component
function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-neutral-300">{label}</p>
        <p className="mt-0.5 text-xs text-neutral-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-900
          ${checked ? "bg-indigo-600" : "bg-neutral-700"}
        `}
      >
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
            ${checked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
}
