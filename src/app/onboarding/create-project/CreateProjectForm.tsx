"use client";

import { CheckCircle2 } from "lucide-react";
import useCreateProjectLogic from "./logic";

export default function CreateProjectPage() {
  const { name, setName, loading, error, handleSubmit } =
    useCreateProjectLogic();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
            <span className="uppercase tracking-wider">Step 1 of 2</span>
            <span>Project Setup</span>
          </div>

          <div className="h-1 w-full bg-neutral-800 rounded">
            <div className="h-1 w-1/2 bg-indigo-500 rounded transition-all duration-300" />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 backdrop-blur p-8 shadow-xl">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight mb-2">
              Create your first project
            </h1>

            <p className="text-sm text-neutral-400 leading-relaxed">
              Projects represent the applications you want to track. You’ll
              receive an API key immediately after creation.
            </p>

            <p className="text-xs text-neutral-500 mt-3 font-medium">
              Takes less than 1 minute.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="text-sm font-medium text-neutral-300 mb-2 block"
                htmlFor="project-name"
              >
                Project name
              </label>

              <input
                type="text"
                required
                name="project-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Marketing Website"
                className="
                  w-full px-4 py-2.5 rounded-lg
                  bg-neutral-950
                  border border-neutral-800
                  focus:outline-none
                  focus:ring-2 focus:ring-indigo-500
                  focus:border-indigo-500
                  transition
                "
              />
            </div>

            {error && <div className="text-sm text-red-500">{error}</div>}

            <button
              type="submit"
              disabled={loading || name.trim() === "" || !name}
              className="
                w-full py-2.5 rounded-lg
                bg-white text-black font-medium
                hover:bg-neutral-200
                transition
                disabled:opacity-50
                cursor-pointer disabled:cursor-not-allowed
              "
              onClick={(e) => handleSubmit(e)} // TypeScript workaround for onClick
            >
              {loading ? "Creating..." : "Create project"}
            </button>
          </form>

          {/* What happens next */}
          <div className="mt-8 border-t border-neutral-800 pt-6">
            <div className="text-xs uppercase tracking-wide text-neutral-500 mb-4">
              What happens next
            </div>

            <div className="space-y-3 text-sm text-neutral-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-indigo-500 mt-0.5" />
                <span>Generate your API key</span>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-indigo-500 mt-0.5" />
                <span>Install the InsightLoop SDK</span>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-indigo-500 mt-0.5" />
                <span>Send your first event to activate insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
