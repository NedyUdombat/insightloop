import { AlertTriangle, CheckCircle, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import type { IApiKey } from "@/api/types/IApiKey";
import Modal from "./Modal";

interface RotateKeyModalProps {
  isOpen: boolean;
  apiKey: IApiKey | null;
  confirmText: string;
  onConfirmTextChange: (text: string) => void;
  onRotate: () => void;
  onClose: () => void;
  newlyRotatedKey: string | null;
  isRotating: boolean;
}

export default function RotateKeyModal({
  isOpen,
  apiKey,
  confirmText,
  onConfirmTextChange,
  onRotate,
  onClose,
  newlyRotatedKey,
  isRotating,
}: RotateKeyModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !apiKey) return null;

  const handleCopy = () => {
    if (newlyRotatedKey) {
      navigator.clipboard.writeText(newlyRotatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      title={newlyRotatedKey ? "API Key Rotated" : "Rotate API Key"}
      onClose={onClose}
    >
      <div className="space-y-4">
        {newlyRotatedKey ? (
          <>
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="text-green-400 mt-0.5 flex-shrink-0"
                  size={20}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-300 mb-2">
                    API key rotated successfully!
                  </p>
                  {apiKey.type === "MANAGEMENT" ? (
                    <p className="text-xs text-neutral-400 mb-3">
                      Make sure to copy your new API key now. You won't be able
                      to see it again!
                    </p>
                  ) : (
                    <p className="text-xs text-neutral-400 mb-3">
                      Make sure to copy your new API key now. The old key has
                      been invalidated.
                    </p>
                  )}
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={newlyRotatedKey}
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
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
              <div className="flex gap-3">
                <AlertTriangle
                  className="text-yellow-400 flex-shrink-0"
                  size={18}
                />
                <div className="text-sm">
                  <p className="font-medium text-yellow-300 mb-1">
                    This will generate a new key
                  </p>
                  <p className="text-neutral-400">
                    The current key "{apiKey.name}" will be immediately
                    invalidated and replaced with a new one. Any applications
                    using the old key will stop working until updated.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="rotateConfirm"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                Type <span className="font-mono text-indigo-400">ROTATE</span>{" "}
                to confirm
              </label>
              <input
                id="rotateConfirm"
                type="text"
                value={confirmText}
                onChange={(e) => onConfirmTextChange(e.target.value)}
                placeholder="ROTATE"
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                onClick={onRotate}
                disabled={confirmText !== "ROTATE" || isRotating}
                className="flex cursor-pointer items-center gap-2 rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRotating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Rotating...
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    Rotate Key
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
