import { CheckCircle, Copy, Plus } from "lucide-react";
import { useState } from "react";
import type { ApiKeyType, Environment } from "@/generated/prisma/enums";
import Modal from "./Modal";

interface CreateKeyModalProps {
  isOpen: boolean;
  keyName: string;
  onKeyNameChange: (name: string) => void;
  keyType: ApiKeyType;
  onKeyTypeChange: (type: ApiKeyType) => void;
  keyEnvironment: Environment;
  onKeyEnvironmentChange: (env: Environment) => void;
  newlyCreatedKey: string | null;
  isCreating: boolean;
  onCreate: () => void;
  onClose: () => void;
}

export default function CreateKeyModal({
  isOpen,
  keyName,
  onKeyNameChange,
  keyType,
  onKeyTypeChange,
  keyEnvironment,
  onKeyEnvironmentChange,
  newlyCreatedKey,
  isCreating,
  onCreate,
  onClose,
}: CreateKeyModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (newlyCreatedKey) {
      navigator.clipboard.writeText(newlyCreatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      title={newlyCreatedKey ? "API Key Created" : "Create New API Key"}
      onClose={onClose}
    >
      <div className="space-y-4">
        {newlyCreatedKey ? (
          <>
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="text-green-400 mt-0.5 flex-shrink-0"
                  size={20}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-300 mb-2">
                    API key created successfully!
                  </p>
                  {keyType === "MANAGEMENT" && (
                    <p className="text-xs text-neutral-400 mb-3">
                      Make sure to copy your API key now. You won't be able to
                      see it again!
                    </p>
                  )}
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={newlyCreatedKey}
                      className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-4 py-2 pr-12 text-sm text-neutral-100 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-neutral-800 rounded transition"
                    >
                      {copied ? (
                        <CheckCircle size={16} className="text-green-400" />
                      ) : (
                        <Copy size={16} className="text-neutral-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md cursor-pointer bg-indigo-600 px-4 py-2 text-sm hover:bg-indigo-500 transition"
              >
                Done
              </button>
            </div>
          </>
        ) : (
          <>
            <div>
              <label
                htmlFor="keyName"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                Key Name
              </label>
              <input
                id="keyName"
                type="text"
                value={keyName}
                onChange={(e) => onKeyNameChange(e.target.value)}
                placeholder="e.g., Production Key, Staging Backend"
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="mt-2 text-xs text-neutral-500">
                Give your key a descriptive name to identify its purpose.
              </p>
            </div>

            <div>
              <label
                htmlFor="keyType"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                Key Type
              </label>
              <select
                id="keyType"
                value={keyType}
                onChange={(e) => onKeyTypeChange(e.target.value as ApiKeyType)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-neutral-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="INGESTION">
                  Ingestion (Public - Send Events)
                </option>
                <option value="MANAGEMENT">
                  Management (Private - Full Access)
                </option>
              </select>
              <p className="mt-2 text-xs text-neutral-500">
                {keyType === "INGESTION"
                  ? "Use in client-side apps to send events only."
                  : "Use server-side for full API access."}
              </p>
            </div>

            <div>
              <label
                htmlFor="keyEnvironment"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                Environment
              </label>
              <select
                id="keyEnvironment"
                value={keyEnvironment}
                onChange={(e) =>
                  onKeyEnvironmentChange(e.target.value as Environment)
                }
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-neutral-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="DEVELOPMENT">Development</option>
                <option value="STAGING">Staging</option>
                <option value="PRODUCTION">Production</option>
              </select>
            </div>

            {keyType === "MANAGEMENT" && (
              <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3">
                <p className="text-xs text-yellow-300">
                  The API key will be shown only once after creation. Make sure
                  to copy and store it securely.
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md cursor-pointer border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onCreate}
                disabled={!keyName.trim() || isCreating}
                className="flex cursor-pointer items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Create Key
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
