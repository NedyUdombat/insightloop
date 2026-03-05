import { Key, Plus } from "lucide-react";

interface EmptyApiKeysStateProps {
  onCreateKey: () => void;
}

export default function EmptyApiKeysState({
  onCreateKey,
}: EmptyApiKeysStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="rounded-full bg-neutral-800 p-4 mb-4">
        <Key className="text-neutral-400" size={32} />
      </div>
      <h3 className="text-lg font-medium text-neutral-200 mb-2">
        No API keys yet
      </h3>
      <p className="text-sm text-neutral-400 mb-6 max-w-md">
        Create your first API key to start integrating InsightLoop with your
        application.
      </p>
      <button
        type="button"
        onClick={onCreateKey}
        className="flex cursor-pointer items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 transition"
      >
        <Plus size={16} />
        Create Your First Key
      </button>
    </div>
  );
}
