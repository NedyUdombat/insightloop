import * as z from "zod";
import { NotificationChannel, DigestFrequency } from "@/generated/prisma/enums";

export const CreateUserSchema = z.strictObject({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[0-9]/, "Password must include a number")
    .regex(
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
      "Password must include a special character",
    )
    .trim(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const LoginSchema = z.strictObject({
  email: z.email("Invalid email address"),
  password: z.string().min(8).trim(),
});

export const UpdateUserSchema = z.strictObject({
  firstname: z.string().min(1).optional(),
  lastname: z.string().min(1).optional(),
  email: z.email("Invalid email address").optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export const UpdateNotificationPreferencesSchema = z.strictObject({
  globalNotificationsEnabled: z.boolean().optional(),
  notificationChannels: z.array(z.nativeEnum(NotificationChannel)).optional(),
  quietHoursStart: z.string().datetime().optional().nullable(),
  quietHoursEnd: z.string().datetime().optional().nullable(),
  digestFrequency: z.nativeEnum(DigestFrequency).optional(),
});

export type UpdateNotificationPreferencesInput = z.infer<
  typeof UpdateNotificationPreferencesSchema
>;
