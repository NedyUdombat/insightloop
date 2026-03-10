import type { PublicUser } from "@/api/types/IUser";
import type {
  UpdateUserInput,
  UpdateNotificationPreferencesInput,
} from "@/api/validators/user";
import { request } from "../helpers/request";

export interface NotificationPreferences {
  globalNotificationsEnabled: boolean;
  notificationChannels: string[];
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  digestFrequency: string;
}

export async function fetchCurrentUser(): Promise<GenericResponse<PublicUser>> {
  return request<PublicUser>("GET", "user/me");
}

export async function updateUserProfile(
  data: UpdateUserInput,
): Promise<GenericResponse<PublicUser>> {
  return request<PublicUser>("PATCH", "user", data);
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<GenericResponse<{ message: string }>> {
  return request<{ message: string }>("POST", "user/change-password", data);
}

export async function getNotificationPreferences(): Promise<
  GenericResponse<NotificationPreferences>
> {
  return request<NotificationPreferences>("GET", "user/notification-preferences");
}

export async function updateNotificationPreferences(
  data: UpdateNotificationPreferencesInput,
): Promise<GenericResponse<NotificationPreferences>> {
  return request<NotificationPreferences>(
    "PATCH",
    "user/notification-preferences",
    data,
  );
}
