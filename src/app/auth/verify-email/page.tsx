"use client";

import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { useVerifyEmailPage } from "@/app/auth/verify-email/logic";
import { AuthForm } from "@/components/auth/AuthForm";

function VerifyEmailContent() {
  const {
    token,
    isPending,
    isSuccess,
    isResending,
    isLoggingOut,
    resendSuccess,
    cooldownRemaining,
    handleResend,
    handleLogout,
  } = useVerifyEmailPage();

  if (token) {
    return (
      <AuthForm
        title="Verifying your email"
        description="Please wait while we verify your account"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center space-y-4 py-4">
          {isPending && (
            <>
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-600 border-t-white" />
              <p className="text-sm text-neutral-400">
                Verifying your email address...
              </p>
            </>
          )}
          {isSuccess && (
            <p className="text-sm text-green-400">
              Email verified! Redirecting...
            </p>
          )}
        </div>
      </AuthForm>
    );
  }

  const resendDisabled = isResending || cooldownRemaining > 0;

  const resendLabel = resendSuccess
    ? cooldownRemaining > 0
      ? `Resend available in ${cooldownRemaining}s`
      : "Resend verification email"
    : "Resend verification email";

  return (
    <AuthForm
      title="Verify your email"
      description="We've sent a verification link to your inbox"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="space-y-4">
        <p className="text-sm text-neutral-400">
          Please verify your email to continue using InsightLoop.
        </p>

        <button
          type="button"
          onClick={() => handleResend()}
          disabled={resendDisabled}
          className="w-full rounded-md border border-neutral-800 py-2 text-sm hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
        >
          {resendLabel}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center justify-center gap-3  w-full text-center text-sm text-neutral-400 hover:text-neutral-200 disabled:opacity-50 cursor-pointer"
        >
          {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : null}
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </AuthForm>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
