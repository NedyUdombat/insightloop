import * as z from "zod";

export const CreateUserSchema = z.strictObject({
  firstname: z.string().min(1, "First name is required"), // Added validation
  lastname: z.string().min(1, "Last name is required"), // Added validation
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[0-9]/, "Password must include a number")
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "Password must include a special character")
    .trim(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const LoginSchema = z.strictObject({
  email: z.email("Invalid email address"),
  password: z.string().min(8).trim(),
});

export const UpdateUserSchema = z.strictObject({
  firstname: z.string().min(1), // Added validation
  lastname: z.string().min(1), // Added validation
  email: z.email("Invalid email address"),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
