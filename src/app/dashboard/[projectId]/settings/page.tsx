"use client";

import * as Tabs from "@radix-ui/react-tabs";
import ApiKeysTab from "./ApiKeysTab";
import GeneralTab from "./GeneralTab";
import useProjectSettingsLogic from "./logic";

export default function ProjectSettingsPage() {
  const { isSingleProjectPending } = useProjectSettingsLogic();

  if (isSingleProjectPending) {
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

        {/* Tabs */}
        <Tabs.Root defaultValue="general" className="w-full">
          <Tabs.List className="flex border-b border-neutral-800 mb-6">
            <Tabs.Trigger
              value="general"
              className="px-4 py-3 text-sm font-medium text-neutral-400 border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:text-white transition cursor-pointer"
            >
              General
            </Tabs.Trigger>
            <Tabs.Trigger
              value="api-keys"
              className="px-4 py-3 text-sm font-medium text-neutral-400 border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:text-white transition cursor-pointer"
            >
              API Keys
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="general">
            <GeneralTab />
          </Tabs.Content>

          <Tabs.Content value="api-keys">
            <ApiKeysTab />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
