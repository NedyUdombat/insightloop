interface GeneralSettingsProps {
  projectName: string;
  setProjectName: (name: string) => void;
  projectId: string;
  createdAt: Date;
}

export default function GeneralSettings({
  projectName,
  setProjectName,
  projectId,
  createdAt,
}: GeneralSettingsProps) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur p-6 space-y-6">
      <div>
        <h2 className="text-lg font-medium text-neutral-200">
          General Settings
        </h2>
        <p className="mt-1 text-sm text-neutral-400">
          Basic project information
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="projectName"
            className="block text-sm font-medium text-neutral-300 mb-2"
          >
            Project Name
          </label>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Enter project name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-neutral-400">Project ID:</span>
            <p className="mt-1 font-mono text-xs text-neutral-300">
              {projectId}
            </p>
          </div>
          <div>
            <span className="text-neutral-400">Created:</span>
            <p className="mt-1 text-neutral-300">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
