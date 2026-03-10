import type { PublicNotification } from "@/api/types/INotification";
import type {
  NotificationStatus,
  NotificationType,
} from "@/generated/prisma/enums";

export interface GetNotificationsParams {
  projectId?: string;
  read?: boolean;
  type?: NotificationType;
  status?: NotificationStatus;
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
}

export interface GetNotificationsResponse {
  notifications: PublicNotification[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface GetUnreadCountResponse {
  count: number;
}

export interface MarkAsReadPayload {
  notificationIds: string[];
}

export interface MarkAllAsReadPayload {
  projectId?: string;
}

export interface DeleteNotificationsPayload {
  notificationIds: string[];
}

export interface DeleteReadNotificationsPayload {
  projectId?: string;
}

export interface MutationResponse {
  message: string;
  count: number;
}
