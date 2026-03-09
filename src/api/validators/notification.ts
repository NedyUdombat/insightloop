import * as z from "zod";
import {
  NotificationType,
  NotificationStatus,
  NotificationChannel,
} from "@/generated/prisma/enums";

export const CreateNotificationSchema = z.strictObject({
  userId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  type: z.nativeEnum(NotificationType).optional().default(NotificationType.SYSTEM),
  status: z.nativeEnum(NotificationStatus).optional().default(NotificationStatus.INFO),
  notificationChannel: z
    .nativeEnum(NotificationChannel)
    .optional()
    .default(NotificationChannel.IN_APP),
  actionUrl: z.string().url().optional().nullable(),
  data: z.record(z.string(), z.any()).optional(),
});

export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;

export const GetNotificationsQuerySchema = z.object({
  projectId: z.string().uuid().optional(),
  read: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  type: z.nativeEnum(NotificationType).optional(),
  status: z.nativeEnum(NotificationStatus).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type GetNotificationsQueryInput = z.infer<
  typeof GetNotificationsQuerySchema
>;

export const MarkAsReadSchema = z.strictObject({
  notificationIds: z.array(z.string().uuid()).min(1).optional(),
  all: z.boolean().optional(),
  projectId: z.string().uuid().optional(),
});

export type MarkAsReadInput = z.infer<typeof MarkAsReadSchema>;

export const DeleteNotificationsSchema = z.strictObject({
  notificationIds: z.array(z.string().uuid()).min(1).optional(),
  allRead: z.boolean().optional(),
  projectId: z.string().uuid().optional(),
});

export type DeleteNotificationsInput = z.infer<typeof DeleteNotificationsSchema>;
