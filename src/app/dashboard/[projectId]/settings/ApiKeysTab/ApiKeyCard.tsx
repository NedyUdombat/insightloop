import { Copy, Eye, EyeOff, Key, RefreshCw, Trash2 } from "lucide-react";
import type { IApiKey } from "@/api/types/IApiKey";

interface ApiKeyCardProps {
  apiKey: IApiKey;
  isVisible: boolean;
  onToggleVisibility: (keyId: string) => void;
  onCopy: (text: string) => void;
  onRotate: (apiKey: IApiKey) => void;
  onRevoke: (apiKey: IApiKey) => void;
}

export default function ApiKeyCard({
  apiKey,
  isVisible,
  onToggleVisibility,
  onCopy,
  onRotate,
  onRevoke,
}: ApiKeyCardProps) {
  return (
    <div className="p-6 hover:bg-neutral-800/30 transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-indigo-500/10 p-2">
              <Key className="text-indigo-400" size={16} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-neutral-200">
                  {apiKey.name}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                  {apiKey.type}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                  {apiKey.environment}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Created {new Date(apiKey.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={
                isVisible && apiKey.keyValue ? apiKey.keyValue : apiKey.keyHint
              }
              readOnly
              className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-4 py-2 pr-24 text-sm text-neutral-300 font-mono"
            />
            {apiKey.keyValue && (
              <div className="absolute right-2 top-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onToggleVisibility(apiKey.id)}
                  className="p-1.5 text-neutral-400 hover:text-white cursor-pointer rounded hover:bg-neutral-800 transition"
                  title={isVisible ? "Hide key" : "Show key"}
                >
                  {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  type="button"
                  onClick={() => onCopy(apiKey.keyValue || apiKey.keyHash)}
                  className="p-1.5 text-neutral-400 hover:text-white cursor-pointer rounded hover:bg-neutral-800 transition"
                  title="Copy key"
                >
                  <Copy size={14} />
                </button>
              </div>
            )}
          </div>

          {apiKey.lastUsedAt && (
            <p className="mt-2 text-xs text-neutral-500">
              Last used {new Date(apiKey.lastUsedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onRotate(apiKey)}
            className="p-2 text-neutral-400 hover:text-indigo-400 cursor-pointer rounded-md border border-neutral-700 hover:border-indigo-500 hover:bg-neutral-800 transition"
            title="Rotate key"
          >
            <RefreshCw size={16} />
          </button>
          <button
            type="button"
            onClick={() => onRevoke(apiKey)}
            className="p-2 text-neutral-400 hover:text-red-400 cursor-pointer rounded-md border border-neutral-700 hover:border-red-500 hover:bg-neutral-800 transition"
            title="Revoke key"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
