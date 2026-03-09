"use client";

import * as Toast from "@radix-ui/react-toast";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Environment } from "@/generated/prisma/enums";

interface ProjectSettings {
  eventNotifications: boolean;
  feedbackNotifications: boolean;
  systemNotifications: boolean;
  securityNotifications: boolean;
  autoArchive: boolean;
  retentionDays: number;
  defaultEnvironment: Environment;
}

interface CreateProjectFormProps {
  mode: "onboarding" | "regular";
  name: string;
  setName: (name: string) => void;
  settings?: ProjectSettings;
  setSettings?: (settings: ProjectSettings) => void;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  toastOpen?: boolean;
  setToastOpen?: (open: boolean) => void;
  toastMessage?: string;
  toastType?: "success" | "error";
}

export default function CreateProjectForm({
  mode,
  name,
  setName,
  settings,
  setSettings,
  loading,
  error,
  onSubmit,
  toastOpen = false,
  setToastOpen,
  toastMessage = "",
  toastType = "success",
}: CreateProjectFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isOnboarding = mode === "onboarding";

  return (
    <>
      <div className="w-full max-w-md">
        {/* Progress (only for onboarding) */}
        {isOnboarding && (
          <div className="mb-10">
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
              <span className="uppercase tracking-wider">Step 1 of 2</span>
              <span>Project Setup</span>
            </div>

            <div className="h-1 w-full bg-neutral-800 rounded">
              <div className="h-1 w-1/2 bg-indigo-500 rounded transition-all duration-300" />
            </div>
          </div>
        )}

        {/* Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur p-8 shadow-xl">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight mb-2">
              {isOnboarding
                ? "Create your first project"
                : "Create a new project"}
            </h1>

            <p className="text-sm text-neutral-400 leading-relaxed">
              Projects represent the applications you want to track. You'll
              receive an API key immediately after creation.
            </p>

            {isOnboarding && (
              <p className="text-xs text-neutral-500 mt-3 font-medium">
                Takes less than 1 minute.
              </p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Project Name */}
            <div>
              <label
                className="text-sm font-medium text-neutral-300 mb-2 block"
                htmlFor="project-name"
              >
                Project name
              </label>

              <input
                type="text"
                required
                name="project-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Marketing Website"
                className="
                  w-full px-4 py-2.5 rounded-lg
                  bg-neutral-950
                  border border-neutral-800
                  focus:outline-none
                  focus:ring-2 focus:ring-indigo-500
                  focus:border-indigo-500
                  transition
                "
              />
            </div>

            {/* Advanced Settings - only show in regular mode */}
            {!isOnboarding && settings && setSettings && (
              <>
                {/* Advanced Settings Toggle */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-300 transition"
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                    />
                    Advanced Settings
                  </button>
                </div>

                {/* Advanced Settings Panel */}
                {showAdvanced && (
                  <div className="space-y-5 pt-2 border-t border-neutral-800">
                    {/* Default Environment */}
                    <div>
                      <label
                        htmlFor="defaultEnvironment"
                        className="block text-sm font-medium text-neutral-300 mb-2"
                      >
                        Default Environment
                      </label>
                      <p className="text-xs text-neutral-500 mb-2">
                        Set the default environment for viewing events and
                        feedback
                      </p>
                      <select
                        id="defaultEnvironment"
                        value={settings.defaultEnvironment}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            defaultEnvironment: e.target.value as Environment,
                          })
                        }
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      >
                        <option value="PRODUCTION">Production</option>
                        <option value="STAGING">Staging</option>
                        <option value="DEVELOPMENT">Development</option>
                      </select>
                    </div>

                    {/* Notification Settings */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-neutral-300">
                        Notifications
                      </h3>

                      <ToggleSwitch
                        label="Event Notifications"
                        description="Generate notifications for new events"
                        checked={settings.eventNotifications}
                        onChange={(checked) =>
                          setSettings({
                            ...settings,
                            eventNotifications: checked,
                          })
                        }
                      />

                      <ToggleSwitch
                        label="Feedback Notifications"
                        description="Generate notifications for new feedback"
                        checked={settings.feedbackNotifications}
                        onChange={(checked) =>
                          setSettings({ ...settings, feedbackNotifications: checked })
                        }
                      />

                      <ToggleSwitch
                        label="System Notifications"
                        description="Generate notifications for system events"
                        checked={settings.systemNotifications}
                        onChange={(checked) =>
                          setSettings({ ...settings, systemNotifications: checked })
                        }
                      />

                      <ToggleSwitch
                        label="Security Notifications"
                        description="Generate notifications for security events"
                        checked={settings.securityNotifications}
                        onChange={(checked) =>
                          setSettings({ ...settings, securityNotifications: checked })
                        }
                      />
                    </div>

                    {/* Data Management */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-neutral-300">
                        Data Management
                      </h3>

                      <div>
                        <label
                          htmlFor="retentionDays"
                          className="block text-sm font-medium text-neutral-300 mb-2"
                        >
                          Event Retention Period
                        </label>
                        <select
                          id="retentionDays"
                          value={settings.retentionDays}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              retentionDays: parseInt(e.target.value, 10),
                            })
                          }
                          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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

                      <ToggleSwitch
                        label="Auto Archive"
                        description="Automatically archive old events"
                        checked={settings.autoArchive}
                        onChange={(checked) =>
                          setSettings({ ...settings, autoArchive: checked })
                        }
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {error && <div className="text-sm text-red-500">{error}</div>}

            <button
              type="submit"
              disabled={loading || name.trim() === "" || !name}
              className="
                w-full py-2.5 rounded-lg
                bg-white text-black font-medium
                hover:bg-neutral-200
                transition
                disabled:opacity-50
                cursor-pointer disabled:cursor-not-allowed
              "
            >
              {loading ? "Creating..." : "Create project"}
            </button>
          </form>

          {/* What happens next */}
          <div className="mt-8 border-t border-neutral-800 pt-6">
            <div className="text-xs uppercase tracking-wide text-neutral-500 mb-4">
              What happens next
            </div>

            <div className="space-y-3 text-sm text-neutral-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-indigo-500 mt-0.5" />
                <span>Generate your API key</span>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-indigo-500 mt-0.5" />
                <span>Install the InsightLoop SDK</span>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-indigo-500 mt-0.5" />
                <span>Send your first event to activate insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification - only for regular mode */}
      {!isOnboarding && setToastOpen && (
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
      )}
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
