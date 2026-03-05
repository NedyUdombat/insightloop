import * as z from "zod";
import { ApiKeyType, Environment } from "@/generated/prisma/enums";

export const CreateProjectSchema = z.strictObject({
  name: z.string().trim().max(100).min(3),
  emailNotifications: z.boolean().optional().default(true),
  eventAlerts: z.boolean().optional().default(true),
  weeklyReports: z.boolean().optional().default(false),
  autoArchive: z.boolean().optional().default(false),
  retentionDays: z.number().int().min(1).max(365).optional().default(30),
  defaultEnvironment: z
    .enum(Environment)
    .optional()
    .default(Environment.DEVELOPMENT),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export const CreateApiKeySchema = z.strictObject({
  name: z.string().trim().max(100).min(3),

  type: z.enum(ApiKeyType),
  environment: z.enum(Environment),
});

export const UpdateProjectSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  emailNotifications: z.boolean().optional(),
  eventAlerts: z.boolean().optional(),
  weeklyReports: z.boolean().optional(),
  autoArchive: z.boolean().optional(),
  retentionDays: z.number().int().min(1).max(365).optional(),
  defaultEnvironment: z.enum(Environment).optional(),
});

export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
