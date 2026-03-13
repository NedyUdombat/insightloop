// End users query calls
import { request } from "../helpers/request";
import type { GetEndUsersParams, PublicEndUser } from "./type";

export async function getEndUsers(
  params: GetEndUsersParams,
): Promise<GenericResponse<PublicEndUser[]>> {
  const { projectId, page, limit, search } = params;

  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (search) queryParams.append("search", search);

  const url = `/projects/${projectId}/end-users?${queryParams.toString()}`;
  return request<PublicEndUser[]>("GET", url);
}
