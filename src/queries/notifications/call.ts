import type { PublicNotification } from "@/api/types/INotification";
import { request } from "../helpers/request";
import type {
  DeleteNotificationsPayload,
  DeleteReadNotificationsPayload,
  GetNotificationsParams,
  GetNotificationsResponse,
  GetUnreadCountResponse,
  MarkAllAsReadPayload,
  MarkAsReadPayload,
  MutationResponse,
} from "./types";

export async function getNotifications(
  params: GetNotificationsParams = {},
): Promise<GenericResponse<GetNotificationsResponse>> {
  const queryParams = new URLSearchParams();

  if (params.projectId) queryParams.append("projectId", params.projectId);
  if (params.read !== undefined)
    queryParams.append("read", params.read.toString());
  if (params.type) queryParams.append("type", params.type);
  if (params.status) queryParams.append("status", params.status);
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.offset) queryParams.append("offset", params.offset.toString());
  if (params.startDate) queryParams.append("startDate", params.startDate);
  if (params.endDate) queryParams.append("endDate", params.endDate);

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `notifications?${queryString}`
    : "notifications";

  return request<GetNotificationsResponse>("GET", endpoint);
}

export async function getNotificationById(
  notificationId: string,
): Promise<GenericResponse<PublicNotification>> {
  return request<PublicNotification>("GET", `notifications/${notificationId}`);
}

export async function getUnreadCount(
  projectId?: string,
): Promise<GenericResponse<GetUnreadCountResponse>> {
  const queryString = projectId ? `?projectId=${projectId}` : "";
  return request<GetUnreadCountResponse>(
    "GET",
    `notifications/unread-count${queryString}`,
  );
}

export async function markAsRead(
  payload: MarkAsReadPayload,
): Promise<GenericResponse<MutationResponse>> {
  return request<MutationResponse>(
    "PATCH",
    "notifications/mark-as-read",
    payload,
  );
}

export async function markAllAsRead(
  payload: MarkAllAsReadPayload = {},
): Promise<GenericResponse<MutationResponse>> {
  return request<MutationResponse>(
    "PATCH",
    "notifications/mark-all-read",
    payload,
  );
}

export async function deleteNotifications(
  payload: DeleteNotificationsPayload,
): Promise<GenericResponse<MutationResponse>> {
  return request<MutationResponse>("DELETE", "notifications", payload);
}

export async function deleteReadNotifications(
  payload: DeleteReadNotificationsPayload = {},
): Promise<GenericResponse<MutationResponse>> {
  return request<MutationResponse>(
    "DELETE",
    "notifications/delete-read",
    payload,
  );
}
