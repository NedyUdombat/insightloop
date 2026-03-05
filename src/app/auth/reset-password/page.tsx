"use client";

import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import useResetPasswordPage from "./logic";

function ResetPasswordContent() {
  const {
    handleSubmit,
    password,
    setPassword,
    loading,
    error,
    isFormValid,
    hasToken,
  } = useResetPasswordPage();

  if (!hasToken) {
    return (
      <AuthForm title="Invalid link" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-4">
          <p className="text-sm text-neutral-400">
            This password reset link is invalid or has expired.
          </p>
          <a
            href="/auth/forgot-password"
            className="block w-full rounded-md bg-white text-black py-2 text-sm font-medium hover:bg-neutral-200 text-center"
          >
            Request a new link
          </a>
        </div>
      </AuthForm>
    );
  }

  return (
    <AuthForm
      title="Set new password"
      description="Choose a strong password for your account"
      onSubmit={handleSubmit}
      footer={
        <a href="/auth/login" className="hover:text-neutral-200">
          Back to sign in
        </a>
      }
    >
      <div className="space-y-4">
        <input
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm"
        />

        <PasswordStrength password={password} />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full rounded-md bg-white text-black py-2 text-sm font-medium hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Resetting..." : "Reset password"}
        </button>
      </div>
    </AuthForm>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
