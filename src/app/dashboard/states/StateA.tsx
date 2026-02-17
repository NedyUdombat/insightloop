export default function StateA() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold">Welcome to InsightLoop</h1>
      <p className="mt-2 text-neutral-400">
        You’re a few minutes away from your first product insight.
      </p>

      <div className="mt-10 rounded-xl border border-neutral-800 bg-neutral-900 p-8">
        <h2 className="text-lg font-medium">Create your first project</h2>

        <p className="mt-2 text-sm text-neutral-400 max-w-xl">
          Projects represent the apps you want to track. You’ll get an API key
          immediately after creating one.
        </p>

        <button className="mt-6 inline-flex rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200">
          Create project
        </button>

        <div className="mt-8 border-t border-neutral-800 pt-6">
          <h3 className="mb-3 text-sm font-medium text-neutral-300">
            What happens next
          </h3>

          <ol className="space-y-2 text-sm text-neutral-400">
            <li>1. Create a project</li>
            <li>2. Copy your API key</li>
            <li>3. Send your first event</li>
          </ol>
        </div>
      </div>

      {/* Footer hint */}
      <p className="mt-8 text-xs text-neutral-500">
        Need help? SDK setup takes less than 5 minutes.
      </p>
    </div>
  );
}
