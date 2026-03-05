"use client";

import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { useVerifyEmailErrorPage } from "@/app/auth/verify-email/error/logic";
import { AuthForm } from "@/components/auth/AuthForm";

function VerifyEmailErrorContent() {
  const {
    copy,
    isResending,
    isLoggingOut,
    resendSuccess,
    cooldownRemaining,
    handleResend,
    handleLogout,
  } = useVerifyEmailErrorPage();

  const resendDisabled = isResending || cooldownRemaining > 0;

  const resendLabel = resendSuccess
    ? cooldownRemaining > 0
      ? `Resend available in ${cooldownRemaining}s`
      : "Resend verification email"
    : "Resend verification email";

  return (
    <AuthForm
      title={copy.title}
      description={copy.message}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="space-y-4">
        <p className="text-sm text-neutral-400">
          You can request a new verification email below.
        </p>

        <button
          type="button"
          onClick={() => handleResend()}
          disabled={resendDisabled}
          className="w-full rounded-md bg-white text-black py-2 text-sm font-medium hover:bg-neutral-200 disabled:opacity-50 cursor-pointer"
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

export default function VerifyEmailErrorPage() {
  return (
    <Suspense>
      <VerifyEmailErrorContent />
    </Suspense>
  );
}
