import { useMemo, useState } from "react";
import useForgotPassword from "@/queries/auth/useForgotPassword";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldErrors = {
  email?: string;
};

const useForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const {
    forgotPassword,
    isPending,
    isSuccess,
    isError,
    error: forgotError,
  } = useForgotPassword();

  const fieldErrors = useMemo((): FieldErrors => {
    const errors: FieldErrors = {};
    if (touched.email && !EMAIL_REGEX.test(email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  }, [email, touched]);

  const isFormValid = useMemo(() => {
    return EMAIL_REGEX.test(email);
  }, [email]);

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ email: true });

    if (!isFormValid) return;

    forgotPassword({ email });
  }

  return {
    handleSubmit,
    email,
    setEmail,
    loading: isPending,
    sent: isSuccess,
    error: isError ? forgotError?.message || "An error occurred" : null,
    fieldErrors,
    isFormValid,
    handleBlur,
  };
};

export default useForgotPasswordPage;
