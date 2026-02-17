import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100">
      <div className="w-full max-w-sm px-6">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold tracking-tight">InsightLoop</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Developer-first product insights
          </p>
        </div>

        {children}

        <p className="mt-8 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} InsightLoop
        </p>
      </div>
    </div>
  );
}
