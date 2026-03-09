import type { PublicUser } from "@/api/types/IUser";
import type { UpdateUserInput } from "@/api/validators/user";
import { request } from "../helpers/request";

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
