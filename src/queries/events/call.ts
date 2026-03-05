import type { PublicEvent } from "@/api/types/IEvent";
import { request } from "../helpers/request";
import type { GetEventsParams } from "./types";

export async function getEvents(
  params: GetEventsParams,
): Promise<GenericResponse<PublicEvent[]>> {
  const {
    projectId,
    page,
    limit,
    search,
    eventName,
    startDate,
    endDate,
    endUserId,
  } = params;

  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (search) queryParams.append("search", search);
  if (eventName) queryParams.append("eventName", eventName);
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (endUserId) queryParams.append("endUserId", endUserId);

  const url = `/projects/${projectId}/events?${queryParams.toString()}`;
  return request<PublicEvent[]>("GET", url);
}

export async function getRecentEvents(
  projectId: string,
): Promise<GenericResponse<PublicEvent[]>> {
  return request<PublicEvent[]>("GET", `/projects/${projectId}/events/recent`);
}
