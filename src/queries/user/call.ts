import type { PublicUser } from "@/api/types/IUser";
import { request } from "../helpers/request";

export async function fetchCurrentUser(): Promise<GenericResponse<PublicUser>> {
  return request<PublicUser>("GET", "user/me");
}
