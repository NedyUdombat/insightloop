import { AlertTriangle, Trash2 } from "lucide-react";
import type { IApiKey } from "@/api/types/IApiKey";
import Modal from "./Modal";

interface RevokeKeyModalProps {
  isOpen: boolean;
  apiKey: IApiKey | null;
  confirmText: string;
  onConfirmTextChange: (text: string) => void;
  isRevoking: boolean;
  onRevoke: () => void;
  onClose: () => void;
}

export default function RevokeKeyModal({
  isOpen,
  apiKey,
  confirmText,
  onConfirmTextChange,
  isRevoking,
  onRevoke,
  onClose,
}: RevokeKeyModalProps) {
  if (!isOpen || !apiKey) return null;

  return (
    <Modal title="Revoke API Key" onClose={onClose}>
      <div className="space-y-4">
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="text-red-400 flex-shrink-0" size={18} />
            <div className="text-sm">
              <p className="font-medium text-red-300 mb-1">
                This action cannot be undone
              </p>
              <p className="text-neutral-400">
                Revoking "{apiKey.name}" will permanently invalidate this key.
                Any applications using it will immediately stop working.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="revokeConfirm"
            className="block text-sm font-medium text-neutral-300 mb-2"
          >
            Type <span className="font-mono text-red-400">{apiKey.name}</span>{" "}
            to confirm
          </label>
          <input
            id="revokeConfirm"
            type="text"
            value={confirmText}
            onChange={(e) => onConfirmTextChange(e.target.value)}
            placeholder={apiKey.name}
            className="w-full rounded-md border border-red-800 bg-red-950/40 px-4 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

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
            onClick={onRevoke}
            disabled={confirmText !== apiKey.name || isRevoking}
            className="flex cursor-pointer items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRevoking ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Revoking...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Revoke Key
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
