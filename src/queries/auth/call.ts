import type { PublicUser } from "@/api/types/IUser";
import type {
  AuthenticatePayload,
  ForgotPasswordPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyEmailResponse,
} from "@/queries/auth/types";
import { request } from "../helpers/request";

export async function authenticate(
  payload: AuthenticatePayload,
): Promise<GenericResponse<PublicUser>> {
  return request<PublicUser>("POST", "/auth/authenticate", payload);
}

export async function register(
  payload: RegisterPayload,
): Promise<GenericResponse<[]>> {
  return request<[]>("POST", "/auth/register", payload);
}

export async function resendVerification(): Promise<GenericResponse<[]>> {
  return request<[]>("POST", "/auth/resend-verification", {});
}

export async function verifyEmail(
  token: string,
): Promise<GenericResponse<VerifyEmailResponse>> {
  return request<VerifyEmailResponse>("POST", "/auth/verify-email", { token });
}

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<GenericResponse<[]>> {
  return request<[]>("POST", "/auth/forgot-password", payload);
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<GenericResponse<[]>> {
  return request<[]>("POST", "/auth/reset-password", payload);
}

export async function logout(): Promise<GenericResponse<[]>> {
  return request<[]>("POST", "/auth/logout", {});
}

export async function logoutAll(): Promise<GenericResponse<[]>> {
  return request<[]>("POST", "/auth/logout-all", {});
}
