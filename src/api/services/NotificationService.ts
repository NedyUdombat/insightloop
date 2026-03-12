import type { JsonObject } from "@prisma/client/runtime/client";
import { prisma } from "@/api/lib/db";
import {
  type DigestFrequency,
  NotificationChannel,
  NotificationStatus,
  NotificationType,
} from "@/generated/prisma/enums";
import type { NotificationWhereInput } from "@/generated/prisma/models/Notification";

export interface CreateNotificationInput {
  userId: string;
  projectId?: string;
  title: string;
  message: string;
  type?: NotificationType;
  status?: NotificationStatus;
  notificationChannel?: NotificationChannel;
  actionUrl?: string;
  data?: Record<string, any>;
}

export interface NotificationFilters {
  userId: string;
  projectId?: string;
  read?: boolean;
  type?: NotificationType;
  status?: NotificationStatus;
  limit?: number;
  offset?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface NotificationPreferences {
  globalNotificationsEnabled?: boolean;
  notificationChannels?: NotificationChannel[];
  quietHoursStart?: Date;
  quietHoursEnd?: Date;
  digestFrequency?: DigestFrequency;
}

class NotificationService {
  /**
   * Create a new notification
   */
  async create(input: CreateNotificationInput) {
    const {
      userId,
      projectId,
      title,
      message,
      type = NotificationType.SYSTEM,
      status = NotificationStatus.INFO,
      notificationChannel = NotificationChannel.IN_APP,
      actionUrl,
      data,
    } = input;

    // Check if user has notifications enabled
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        globalNotificationsEnabled: true,
        notificationChannels: true,
        quietHoursStart: true,
        quietHoursEnd: true,
      },
    });

    if (!user || !user.globalNotificationsEnabled) {
      return null;
    }

    // Check if the notification channel is enabled for the user
    if (!user.notificationChannels.includes(notificationChannel)) {
      return null;
    }

    // Check quiet hours
    if (this.isInQuietHours(user.quietHoursStart, user.quietHoursEnd)) {
      return null;
    }

    // If projectId is provided, check project notification settings
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: {
          eventNotifications: true,
          feedbackNotifications: true,
          systemNotifications: true,
          securityNotifications: true,
        },
      });

      if (!project || !this.isProjectNotificationEnabled(project, type)) {
        return null;
      }
    }

    return await prisma.notification.create({
      data: {
        userId,
        projectId,
        title,
        message,
        type,
        status,
        notificationChannel,
        actionUrl,
        data: data ? (data as JsonObject) : undefined,
      },
    });
  }

  /**
   * Create multiple notifications in bulk
   */
  async createBulk(notifications: CreateNotificationInput[]) {
    const results = await Promise.allSettled(
      notifications.map((notification) => this.create(notification)),
    );

    return results
      .filter((result) => result.status === "fulfilled")
      .map((result) => (result as PromiseFulfilledResult<any>).value)
      .filter(Boolean);
  }

  /**
   * Get notifications with filters
   */
  async getNotifications(filters: NotificationFilters) {
    const {
      userId,
      projectId,
      read,
      type,
      status,
      limit = 50,
      offset = 0,
      startDate,
      endDate,
    } = filters;

    const where: NotificationWhereInput = {
      userId,
      deletedAt: null,
      ...(projectId && { projectId }),
      ...(read !== undefined && { read }),
      ...(type && { type }),
      ...(status && { status }),
      ...(startDate &&
        endDate && {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }),
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string, projectId?: string) {
    return await prisma.notification.count({
      where: {
        userId,
        read: false,
        deletedAt: null,
        ...(projectId && { projectId }),
      },
    });
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    return await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
        deletedAt: null,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Mark multiple notifications as read
   */
  async markMultipleAsRead(notificationIds: string[], userId: string) {
    return await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId,
        deletedAt: null,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string, projectId?: string) {
    return await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
        deletedAt: null,
        ...(projectId && { projectId }),
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Delete a notification (soft delete)
   */
  async delete(notificationId: string, userId: string) {
    return await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Delete multiple notifications
   */
  async deleteMultiple(notificationIds: string[], userId: string) {
    return await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Delete all read notifications for a user
   */
  async deleteAllRead(userId: string, projectId?: string) {
    return await prisma.notification.updateMany({
      where: {
        userId,
        read: true,
        deletedAt: null,
        ...(projectId && { projectId }),
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Get notification by ID
   */
  async getById(notificationId: string, userId: string) {
    return await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
        deletedAt: null,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Update user notification preferences
   */
  async updatePreferences(
    userId: string,
    preferences: NotificationPreferences,
  ) {
    return await prisma.user.update({
      where: { id: userId },
      data: preferences,
    });
  }

  /**
   * Get user notification preferences
   */
  async getPreferences(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        globalNotificationsEnabled: true,
        notificationChannels: true,
        quietHoursStart: true,
        quietHoursEnd: true,
        digestFrequency: true,
      },
    });
  }

  /**
   * Create notification for new event
   */
  async createEventNotification({
    userId,
    projectId,
    eventName,
    eventId,
  }: {
    userId: string;
    projectId: string;
    eventName: string;
    eventId: string;
  }) {
    return await this.create({
      userId,
      projectId,
      title: "New Event Tracked",
      message: `Event "${eventName}" was tracked in your project`,
      type: NotificationType.EVENT,
      status: NotificationStatus.INFO,
      actionUrl: `/dashboard/${projectId}/events/${eventId}`,
      data: { eventName, eventId },
    });
  }

  /**
   * Create notification for new feedback
   */
  async createFeedbackNotification(
    userId: string,
    projectId: string,
    feedbackTitle: string,
    feedbackId: string,
    rating?: number,
  ) {
    const status =
      rating && rating <= 2
        ? NotificationStatus.WARNING
        : NotificationStatus.INFO;

    return await this.create({
      userId,
      projectId,
      title: "New Feedback Received",
      message: feedbackTitle
        ? `"${feedbackTitle}" - Rating: ${rating || "N/A"}`
        : `New feedback with rating: ${rating || "N/A"}`,
      type: NotificationType.FEEDBACK,
      status,
      actionUrl: `/dashboard/${projectId}/feedback/${feedbackId}`,
      data: { feedbackId, rating },
    });
  }

  /**
   * Create notification for project updates
   */
  async createProjectNotification(
    userId: string,
    projectId: string,
    title: string,
    message: string,
    status: NotificationStatus = NotificationStatus.INFO,
  ) {
    return await this.create({
      userId,
      projectId,
      title,
      message,
      type: NotificationType.PROJECT,
      status,
    });
  }

  /**
   * Create security notification
   */
  async createSecurityNotification(
    userId: string,
    title: string,
    message: string,
    projectId?: string,
  ) {
    return await this.create({
      userId,
      projectId,
      title,
      message,
      type: NotificationType.SECURITY,
      status: NotificationStatus.WARNING,
    });
  }

  /**
   * Check if current time is within quiet hours
   */
  private isInQuietHours(
    quietHoursStart?: Date | null,
    quietHoursEnd?: Date | null,
  ): boolean {
    if (!quietHoursStart || !quietHoursEnd) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTime =
      quietHoursStart.getHours() * 60 + quietHoursStart.getMinutes();
    const endTime = quietHoursEnd.getHours() * 60 + quietHoursEnd.getMinutes();

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  /**
   * Check if project notification type is enabled
   */
  private isProjectNotificationEnabled(
    project: {
      eventNotifications: boolean;
      feedbackNotifications: boolean;
      systemNotifications: boolean;
      securityNotifications: boolean;
    },
    type: NotificationType,
  ): boolean {
    switch (type) {
      case NotificationType.EVENT:
        return project.eventNotifications;
      case NotificationType.FEEDBACK:
        return project.feedbackNotifications;
      case NotificationType.SYSTEM:
        return project.systemNotifications;
      case NotificationType.SECURITY:
        return project.securityNotifications;
      default:
        return true;
    }
  }

  /**
   * Get notifications grouped by project
   */
  async getNotificationsByProject(userId: string) {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const grouped = notifications.reduce(
      (acc, notification) => {
        const projectKey = notification.projectId || "global";
        if (!acc[projectKey]) {
          acc[projectKey] = [];
        }
        acc[projectKey].push(notification);
        return acc;
      },
      {} as Record<string, typeof notifications>,
    );

    return grouped;
  }

  /**
   * Clean up old read notifications (older than retention days)
   */
  async cleanupOldNotifications(userId: string, retentionDays: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    return await prisma.notification.updateMany({
      where: {
        userId,
        read: true,
        createdAt: {
          lt: cutoffDate,
        },
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

const notificationService = new NotificationService();
export default notificationService;
