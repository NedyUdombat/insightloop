import { request } from "../helpers/request";
import type { RecentActivity } from "./types";

export async function getRecentActivity(
  projectId: string,
): Promise<GenericResponse<RecentActivity[]>> {
  return request<RecentActivity[]>(
    "GET",
    `/projects/${projectId}/recent-activity`,
  );
}
