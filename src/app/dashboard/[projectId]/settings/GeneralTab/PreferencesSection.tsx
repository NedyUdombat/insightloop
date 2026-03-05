import type { Environment } from "@/generated/prisma/enums";
import type { ProjectPreferences } from "../logic";
import ToggleSwitch from "./ToggleSwitch";

interface PreferencesSectionProps {
  preferences: ProjectPreferences;
  setPreferences: (preferences: ProjectPreferences) => void;
}

export default function PreferencesSection({
  preferences,
  setPreferences,
}: PreferencesSectionProps) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur p-6 space-y-6">
      <div>
        <h2 className="text-lg font-medium text-neutral-200">Preferences</h2>
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
                  retentionDays: parseInt(e.target.value, 10),
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
          <h3 className="text-sm font-medium text-neutral-300">Environment</h3>

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
                  defaultEnvironment: e.target.value as Environment,
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
  );
}
