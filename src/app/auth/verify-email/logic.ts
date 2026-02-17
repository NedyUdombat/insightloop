import useVerifyEmail from "@/queries/auth/useVerifyEmail";
import useResendVerification from "@/queries/auth/useResendVerification";
import useLogout from "@/queries/auth/useLogout";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const RESEND_COOLDOWN_MS = 60_000;

export const useVerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const { isPending, isError, isSuccess, data, verify } = useVerifyEmail();
  const {
    isPending: isResending,
    isSuccess: resendSuccess,
    resend,
  } = useResendVerification();
  const { logout, isPending: isLoggingOut } = useLogout();

  const hasVerified = useRef(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  useEffect(() => {
    if (token && !hasVerified.current) {
      hasVerified.current = true;
      verify(token);
    }
  }, [token, verify]);

  useEffect(() => {
    if (isSuccess && data) {
      if (data.data.hasSession) {
        router.replace("/dashboard");
      } else {
        router.replace("/auth/login?verified=true");
      }
    }
  }, [isSuccess, data, router]);

  useEffect(() => {
    if (isError && token) {
      router.replace(
        "/auth/verify-email/error?reason=invalid_or_expired_token",
      );
    }
  }, [isError, token, router]);

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
    token,
    isPending,
    isSuccess,
    isResending,
    isLoggingOut,
    resendSuccess,
    cooldownRemaining,
    handleResend,
    handleLogout,
  };
};
