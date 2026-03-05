import { AlertTriangle, Trash2 } from "lucide-react";

interface DangerZoneProps {
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  deleteConfirmText: string;
  setDeleteConfirmText: (text: string) => void;
  projectName: string;
  handleDeleteProject: () => void;
  isDeleting: boolean;
  setError: (error: string | null) => void;
}

export default function DangerZone({
  showDeleteConfirm,
  setShowDeleteConfirm,
  deleteConfirmText,
  setDeleteConfirmText,
  projectName,
  handleDeleteProject,
  isDeleting,
  setError,
}: DangerZoneProps) {
  return (
    <div className="rounded-2xl border border-red-900/50 bg-red-950/20 backdrop-blur p-6 space-y-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-red-400 mt-0.5" size={20} />
        <div>
          <h2 className="text-lg font-medium text-red-400">Danger Zone</h2>
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
                {projectName}
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
              disabled={isDeleting || deleteConfirmText !== projectName}
              className="flex cursor-pointer items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={16} />
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
