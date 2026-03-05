"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import useForgotPasswordPage from "./logic";

export default function ForgotPasswordPage() {
  const {
    handleSubmit,
    email,
    setEmail,
    loading,
    sent,
    error,
    fieldErrors,
    isFormValid,
    handleBlur,
  } = useForgotPasswordPage();

  return (
    <AuthForm
      title="Reset your password"
      description="We'll email you a reset link"
      onSubmit={handleSubmit}
      footer={
        <a href="/auth/login" className="hover:text-neutral-200">
          Back to sign in
        </a>
      }
    >
      <div className="space-y-4">
        {sent ? (
          <div className="rounded-md bg-green-900/30 border border-green-800 px-3 py-3 text-sm text-green-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            If an account exists with that email, we&apos;ve sent a reset link.
            Check your inbox.
          </div>
        ) : (
          <>
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

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full rounded-md bg-white text-black py-2 text-sm font-medium hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </>
        )}
      </div>
    </AuthForm>
  );
}
