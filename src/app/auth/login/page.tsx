"use client";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import useLoginAccount from "./logic";

function LoginContent() {
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified") === "true";

  const {
    handleSubmit,
    email,
    password,
    loading,
    error,
    setEmail,
    setPassword,
    fieldErrors,
    isFormValid,
    handleBlur,
  } = useLoginAccount();

  return (
    <AuthForm
      title="Sign in"
      description="Welcome back"
      onSubmit={handleSubmit}
      footer={
        <a href="/auth/register" className="hover:text-neutral-200">
          Don&apos;t have an account? Register
        </a>
      }
    >
      <div className="space-y-4">
        {verified && (
          <p className="rounded-md bg-green-900/30 border border-green-800 px-3 py-2 text-sm text-green-400">
            Email verified successfully. Please sign in to continue.
          </p>
        )}

        <div>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
            className={`w-full rounded-md bg-neutral-950 border px-3 py-2 text-sm ${
              fieldErrors.email ? "border-red-500" : "border-neutral-800"
            }`}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm"
        />

        <div className="flex justify-end text-xs text-neutral-400">
          <a href="/auth/forgot-password" className="hover:text-neutral-200">
            Forgot your password?
          </a>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full rounded-md bg-white text-black py-2 text-sm font-medium hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </AuthForm>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
