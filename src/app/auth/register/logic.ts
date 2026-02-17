import useRegister from "@/queries/auth/useRegister";
import { isPasswordStrong } from "@/components/auth/PasswordStrength";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type FieldErrors = {
  firstname?: string;
  lastname?: string;
  email?: string;
};

const useRegisterAccount = () => {
  const router = useRouter();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { register, isPending, isError, error: registerError } = useRegister();

  const fieldErrors = useMemo((): FieldErrors => {
    const errors: FieldErrors = {};

    if (touched.firstname && firstname.trim().length === 0) {
      errors.firstname = "First name is required";
    }

    if (touched.lastname && lastname.trim().length === 0) {
      errors.lastname = "Last name is required";
    }

    if (touched.email && !EMAIL_REGEX.test(email)) {
      errors.email = "Invalid email address";
    }

    return errors;
  }, [firstname, lastname, email, touched]);

  const isFormValid = useMemo(() => {
    return (
      firstname.trim().length > 0 &&
      lastname.trim().length > 0 &&
      EMAIL_REGEX.test(email) &&
      isPasswordStrong(password)
    );
  }, [firstname, lastname, email, password]);

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setTouched({ firstname: true, lastname: true, email: true });

    if (!isFormValid) return;

    register(
      { email, password, firstname, lastname },
      {
        onSuccess: () => {
          router.push("/auth/verify-email");
        },
      },
    );
  }

  return {
    handleSubmit,
    firstname,
    setFirstname,
    lastname,
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
