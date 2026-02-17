import { z } from "zod";

export const EmailOnlySchema = z.strictObject({
  email: z.email(),
});

export const ResetPasswordSchema = z.strictObject({
  token: z.string(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[0-9]/, "Password must include a number")
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "Password must include a special character")
    .trim(),
});
