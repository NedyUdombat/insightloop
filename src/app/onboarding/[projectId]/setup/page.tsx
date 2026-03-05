"use client";

import * as Tabs from "@radix-ui/react-tabs";
import * as Toast from "@radix-ui/react-toast";
import { Copy, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import useSetupLogic, { type PackageManager, type SdkType } from "./logic";

export default function SetupPage() {
  const {
    toastOpen,
    setToastOpen,
    handleCopy,
    apiKey,
    apiKeyHint,
    projectId,
    toastMessage,
    getInstallCommand,
    getInitializeCode,
    getTrackCode,
    activeSdk,
    setActiveSdk,
    activePm,
    setActivePm,
    count,
    refetch,
    showApiKey,
    setShowApiKey,
  } = useSetupLogic();

  return (
    <>
      <div className="relative flex min-h-screen items-center justify-center bg-neutral-950 px-6 py-16 text-neutral-100 overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.08),transparent_60%)] pointer-events-none" />
        <div className="w-full max-w-3xl">
          {/* Step indicator */}
          <div className="mb-10">
            <div className="flex justify-between text-xs text-neutral-500">
              <span>Step 2 of 2</span>
              <span>Activate InsightLoop</span>
            </div>
            <div className="mt-2 h-1 w-full rounded-full bg-neutral-800">
              <div className="h-1 w-full rounded-full bg-indigo-500" />
            </div>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 shadow-xl">
            <div className="border-b border-neutral-800 px-8 py-6">
              <h1 className="text-2xl font-semibold tracking-tight">
                Activate your project
              </h1>
              <p className="mt-2 text-sm text-neutral-400">
                Install the SDK, initialize it with your API key, and send your
                first event.
              </p>
            </div>

            <div className="p-8 space-y-10">
              {/* API KEY */}
              <div>
                <h3 className="text-sm font-medium text-neutral-300">
                  Your API key
                </h3>

                <div className="relative mt-2">
                  <input
                    value={showApiKey ? apiKey || "" : apiKeyHint || ""}
                    readOnly
                    className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-4 py-3 pr-20 text-sm text-neutral-300"
                  />
                  <div className="absolute right-3 top-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-neutral-400 hover:text-white cursor-pointer"
                      title={showApiKey ? "Hide API key" : "Show API key"}
                    >
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy({
                          value: apiKey,
                          toast: "API key copied to clipboard",
                        })
                      }
                      className="text-neutral-400 hover:text-white cursor-pointer"
                      title="Copy API key"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <p className="mt-2 text-xs text-red-500">
                  This key is shown once. Copy and store it securely. If lost,
                  you'll need to generate a new one.
                </p>
              </div>

              {!count ||
                (count === 0 && (
                  <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
                    <p className="text-sm text-yellow-300 font-medium">
                      Waiting for your first event...
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Once InsightLoop receives your first event, you'll be
                      redirected automatically.
                    </p>

                    <button
                      type="button"
                      onClick={() => refetch()}
                      className="mt-3 text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      I've sent the event — Check again
                    </button>
                  </div>
                ))}
              {/* SDK Tabs */}
              <Tabs.Root
                value={activeSdk}
                onValueChange={(value) => setActiveSdk(value as SdkType)}
                className="w-full"
              >
                <div className="rounded-xl border border-neutral-800 overflow-hidden">
                  {/* Top SDK Tabs */}
                  <Tabs.List className="flex border-b border-neutral-800 bg-neutral-950">
                    {["browser", "node", "react-native"].map((sdk) => (
                      <Tabs.Trigger
                        key={sdk}
                        value={sdk}
                        className="capitalize px-5 py-3 text-sm text-neutral-400 data-[state=active]:bg-neutral-900 data-[state=active]:text-white  cursor-pointer"
                      >
                        {sdk === "react-native" ? "React Native" : sdk}
                      </Tabs.Trigger>
                    ))}
                  </Tabs.List>

                  <div className="p-6">
                    {["browser", "node", "react-native"].map((sdk) => (
                      <Tabs.Content key={sdk} value={sdk}>
                        {/* INSTALL */}
                        <div>
                          <h2 className="text-lg font-medium">
                            1. Install the SDK
                          </h2>
                          <p className="mt-1 text-sm text-neutral-400">
                            Add InsightLoop to your project using your preferred
                            package manager.
                          </p>

                          <Tabs.Root
                            value={activePm}
                            onValueChange={(value) =>
                              setActivePm(value as PackageManager)
                            }
                            className="mt-4"
                          >
                            <Tabs.List className="flex gap-2 mb-4">
                              {["npm", "yarn", "pnpm", "bun"].map((pm) => (
                                <Tabs.Trigger
                                  key={pm}
                                  value={pm}
                                  className="rounded-md border border-neutral-700 px-3 py-1 text-xs text-neutral-400 data-[state=active]:bg-neutral-800 data-[state=active]:text-white cursor-pointer"
                                >
                                  {pm}
                                </Tabs.Trigger>
                              ))}
                            </Tabs.List>

                            {["npm", "yarn", "pnpm", "bun"].map((pm) => (
                              <Tabs.Content key={pm} value={pm}>
                                <CodeBlock
                                  code={getInstallCommand()}
                                  onCopy={() =>
                                    handleCopy({
                                      value: getInstallCommand(),
                                      toast: `Copied ${activePm} install command`,
                                    })
                                  }
                                />
                              </Tabs.Content>
                            ))}
                          </Tabs.Root>
                        </div>

                        {/* INITIALIZE */}
                        <div>
                          <h2 className="text-lg font-medium">
                            2. Initialize InsightLoop
                          </h2>
                          <p className="mt-1 text-sm text-neutral-400">
                            Initialize once in your application entry point.
                            {sdk === "browser" &&
                              " Place this in your main layout or entry JS file."}
                            {sdk === "node" &&
                              " Initialize when your server boots."}
                            {sdk === "react-native" &&
                              " Place inside your root App component."}
                          </p>

                          <CodeBlock
                            code={getInitializeCode()}
                            onCopy={() =>
                              handleCopy({
                                value: getInitializeCode(),
                                toast: `Copied ${activeSdk} initialization snippet`,
                              })
                            }
                          />
                        </div>

                        {/* TRACK */}
                        <div>
                          <h2 className="text-lg font-medium">
                            3. Send your first event
                          </h2>
                          <p className="mt-1 text-sm text-neutral-400">
                            Trigger a simple event to confirm everything is
                            working.
                          </p>

                          <CodeBlock
                            code={getTrackCode()}
                            onCopy={() =>
                              handleCopy({
                                value: getTrackCode(),
                                toast: `Copied ${activeSdk} tracking example`,
                              })
                            }
                          />
                        </div>
                      </Tabs.Content>
                    ))}
                  </div>
                </div>
              </Tabs.Root>

              {/* Footer */}
              <div className="flex justify-between items-center pt-6 border-t border-neutral-800">
                <Link
                  href={`/dashboard/${projectId}`}
                  className="text-sm text-neutral-400 hover:text-white"
                >
                  Skip for now →
                </Link>

                <Link
                  href="/docs/getting-started"
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  View full documentation →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Colored Toast */}
      <Toast.Root
        open={toastOpen}
        onOpenChange={setToastOpen}
        duration={2000}
        className="rounded-lg border border-indigo-500/40 bg-indigo-600/10 backdrop-blur px-4 py-3 shadow-lg"
      >
        <Toast.Title className="text-sm font-medium text-indigo-300">
          {toastMessage}
        </Toast.Title>
      </Toast.Root>
    </>
  );
}

/* CodeBlock Component */
function CodeBlock({
  code,
  onCopy,
}: {
  code: string;
  onCopy: (value: string) => void;
}) {
  return (
    <div className="relative mt-4">
      <pre className="overflow-x-auto rounded-lg border border-neutral-800 bg-black p-4 text-sm text-neutral-200">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={() => onCopy(code)}
        className="absolute right-3 top-3 text-neutral-400 hover:text-white  cursor-pointer"
      >
        <Copy size={16} />
      </button>
    </div>
  );
}
