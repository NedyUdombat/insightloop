import useResetPassword from "@/queries/auth/useResetPassword";
import { isPasswordStrong } from "@/components/auth/PasswordStrength";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const useResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");

  const {
    resetPassword,
    isPending,
    isError,
    error: resetError,
  } = useResetPassword();

  const isFormValid = useMemo(() => {
    return !!token && isPasswordStrong(password);
  }, [token, password]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormValid || !token) return;

    resetPassword(
      { token, password },
      {
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
    );
  }

  return {
    handleSubmit,
    password,
    setPassword,
    loading: isPending,
    error: isError ? resetError?.message || "An error occurred" : null,
    isFormValid,
    hasToken: !!token,
  };
};

export default useResetPasswordPage;
