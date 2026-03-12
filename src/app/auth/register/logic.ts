import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { isPasswordStrong } from "@/components/auth/PasswordStrength";
import useRegister from "@/queries/auth/useRegister";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

const useRegisterAccount = () => {
  const router = useRouter();
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { register, isPending, isError, error: registerError } = useRegister();

  const fieldErrors = useMemo((): FieldErrors => {
    const errors: FieldErrors = {};

    if (touched.firstName && firstName.trim().length === 0) {
      errors.firstName = "First name is required";
    }

    if (touched.lastName && lastName.trim().length === 0) {
      errors.lastName = "Last name is required";
    }

    if (touched.email && !EMAIL_REGEX.test(email)) {
      errors.email = "Invalid email address";
    }

    return errors;
  }, [firstName, lastName, email, touched]);

  const isFormValid = useMemo(() => {
    return (
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      EMAIL_REGEX.test(email) &&
      isPasswordStrong(password)
    );
  }, [firstName, lastName, email, password]);

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setTouched({ firstName: true, lastName: true, email: true });

    if (!isFormValid) return;

    register(
      { email, password, firstName, lastName },
      {
        onSuccess: () => {
          router.push("/auth/verify-email");
        },
      },
    );
  }

  return {
    handleSubmit,
    firstName,
    setFirstname,
    lastName,
    setLastname,
    email,
    setEmail,
    password,
    setPassword,
    loading: isPending,
    error: isError ? registerError?.message || "An error occurred" : null,
    fieldErrors,
    isFormValid,
    handleBlur,
  };
};

export default useRegisterAccount;
