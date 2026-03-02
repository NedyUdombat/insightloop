import useLogin from "@/queries/auth/useLogin";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldErrors = {
  email?: string;
};

const useLoginAccount = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { login, isPending, isError, error: loginError } = useLogin();

  const fieldErrors = useMemo((): FieldErrors => {
    const errors: FieldErrors = {};
    if (touched.email && !EMAIL_REGEX.test(email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  }, [email, touched]);

  const isFormValid = useMemo(() => {
    return EMAIL_REGEX.test(email) && password.length >= 8;
  }, [email, password]);

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ email: true });

    if (!isFormValid) return;

    login(
      { email, password },
      {
        onSuccess: (data) => {
          const user = data.data;

          // Check email verification first
          if (!user.emailVerified) {
            router.push("/auth/verify-email/error?reason=email_not_verified");
            return;
          }

          // Determine navigation based on project state
          if (user.projects?.length === 0) {
            router.push("/onboarding/create-project");
            return;
          }

          // Navigate to last used project or first available
          router.push(
            `/dashboard/${user.lastProjectId ?? user.projects?.[0]?.id}`,
          );
        },
        onError: (error) => {
          // Add error handling
          console.error("Login failed:", error);
          // Optionally: setError("Failed to login. Please try again.");
        },
      },
    );
  }

  return {
    handleSubmit,
    email,
    setEmail,
    password,
    setPassword,
    loading: isPending,
    error: isError ? loginError?.message || "An error occurred" : null,
    fieldErrors,
    isFormValid,
    handleBlur,
  };
};

export default useLoginAccount;
