import useResendVerification from "@/queries/auth/useResendVerification";
import useLogout from "@/queries/auth/useLogout";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const RESEND_COOLDOWN_MS = 60_000;

const ERROR_COPY: Record<string, { title: string; message: string }> = {
  invalid_or_expired_token: {
    title: "Verification link expired",
    message:
      "This verification link is no longer valid. Verification links expire for security reasons.",
  },
  missing_token: {
    title: "Invalid verification link",
    message:
      "The verification link is missing required information. Please request a new one.",
  },
  email_not_verified: {
    title: "Email not verified",
    message:
      "Your email address hasn't been verified yet. Please check your inbox or request a new verification email.",
  },
};

export const useVerifyEmailErrorPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reason = searchParams.get("reason") ?? "invalid_or_expired_token";
  const copy = ERROR_COPY[reason] ?? ERROR_COPY.invalid_or_expired_token;

  const {
    isPending: isResending,
    isSuccess: resendSuccess,
    resend,
  } = useResendVerification();
  const { logout, isPending: isLoggingOut } = useLogout();

  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  useEffect(() => {
    if (cooldownRemaining <= 0) return;

    const interval = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1_000);

    return () => clearInterval(interval);
  }, [cooldownRemaining]);

  const handleResend = useCallback(() => {
    if (cooldownRemaining > 0 || isResending) return;

    resend(undefined, {
      onSuccess: () => {
        setCooldownRemaining(RESEND_COOLDOWN_MS / 1_000);
      },
    });
  }, [cooldownRemaining, isResending, resend]);

  const handleLogout = useCallback(() => {
    logout(undefined, {
      onSuccess: () => router.replace("/auth/login"),
    });
  }, [logout, router]);

  return {
    copy,
    isResending,
    isLoggingOut,
    resendSuccess,
    cooldownRemaining,
    handleResend,
    handleLogout,
  };
};
