"use client";

import { Loader2 } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import useRegisterAccount from "./logic";

export default function RegisterPage() {
  const {
    handleSubmit,
    password,
    setPassword,
    error,
    firstname,
    setFirstname,
    lastname,
    setLastname,
    email,
    setEmail,
    loading,
    fieldErrors,
    isFormValid,
    handleBlur,
  } = useRegisterAccount();

  return (
    <AuthForm
      title="Create account"
      description="Get started with InsightLoop"
      onSubmit={handleSubmit}
      footer={
        <a href="/auth/login" className="hover:text-neutral-200">
          Already have an account? Sign in
        </a>
      }
    >
      <div className="space-y-4">
        <div>
          <input
            name="firstname"
            type="text"
            required
            autoComplete="given-name"
            placeholder="First name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            onBlur={() => handleBlur("firstname")}
            className={`w-full rounded-md bg-neutral-950 border px-3 py-2 text-sm ${
              fieldErrors.firstname ? "border-red-500" : "border-neutral-800"
            }`}
          />
          {fieldErrors.firstname && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.firstname}</p>
          )}
        </div>

        <div>
          <input
            name="lastname"
            type="text"
            required
            autoComplete="family-name"
            placeholder="Last name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            onBlur={() => handleBlur("lastname")}
            className={`w-full rounded-md bg-neutral-950 border px-3 py-2 text-sm ${
              fieldErrors.lastname ? "border-red-500" : "border-neutral-800"
            }`}
          />
          {fieldErrors.lastname && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.lastname}</p>
          )}
        </div>

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

        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          // autoComplete="new-password"
          value={password}
          className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-sm"
          onChange={(e) => setPassword(e.target.value)}
        />

        <PasswordStrength password={password} />
        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full rounded-md bg-white text-black py-2 text-sm font-medium hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Creating account..." : "Create account"}
        </button>
      </div>
    </AuthForm>
  );
}
