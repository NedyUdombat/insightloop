import type {
  NotificationChannel,
  NotificationStatus,
  NotificationType,
} from "@/generated/prisma/enums";
import type { IModel } from "./IModel";
import type { IProject } from "./IProject";
import type { IUser } from "./IUser";

export interface INotification extends IModel {
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  notificationChannel: NotificationChannel;
  read: boolean;
  actionUrl: string | null;
  // biome-ignore lint/suspicious/noExplicitAny: <object>
  data: Record<string, any> | null;
  readAt: Date | null;
  userId: string;
  user?: IUser;
  projectId: string | null;
  project?: IProject | null;
}

export interface PublicNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  notificationChannel: NotificationChannel;
  read: boolean;
  actionUrl: string | null;
  data: Record<string, any> | null;
  readAt: Date | null;
  userId: string;
  projectId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
