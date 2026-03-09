import * as z from "zod";
import { ApiKeyType, Environment } from "@/generated/prisma/enums";

export const CreateProjectSchema = z.strictObject({
  name: z.string().trim().max(100).min(3),
  eventNotifications: z.boolean().optional().default(true),
  feedbackNotifications: z.boolean().optional().default(true),
  systemNotifications: z.boolean().optional().default(true),
  securityNotifications: z.boolean().optional().default(true),
  autoArchive: z.boolean().optional().default(false),
  retentionDays: z.number().int().min(1).max(365).optional().default(30),
  defaultEnvironment: z
    .nativeEnum(Environment)
    .optional()
    .default(Environment.DEVELOPMENT),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export const CreateApiKeySchema = z.strictObject({
  name: z.string().trim().max(100).min(3),
  type: z.nativeEnum(ApiKeyType),
  environment: z.nativeEnum(Environment),
});

export type CreateApiKeyInput = z.infer<typeof CreateApiKeySchema>;

export const UpdateProjectSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  eventNotifications: z.boolean().optional(),
  feedbackNotifications: z.boolean().optional(),
  systemNotifications: z.boolean().optional(),
  securityNotifications: z.boolean().optional(),
  autoArchive: z.boolean().optional(),
  retentionDays: z.number().int().min(1).max(365).optional(),
  defaultEnvironment: z.nativeEnum(Environment).optional(),
});

export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
