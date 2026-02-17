import { PublicUser } from "@/api/types/IUser";
import { getAppUrl } from "@/queries/helpers";
import {
  AuthenticatePayload,
  ForgotPasswordPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyEmailResponse,
} from "@/queries/auth/types";

const apiUrl = `${getAppUrl(true)}/api/auth`;

async function request<T>(
  endpoint: string,
  body: unknown,
): Promise<GenericResponse<T>> {
  const res = await fetch(`${apiUrl}/${endpoint}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      body?.message || `Request failed with status ${res.status}`,
    );
  }

  const response = (await res.json()) as GenericResponse<T>;
  if (!response.success) {
    throw new Error(response.message || "An error occurred");
  }
  return response;
}

export async function authenticate(
  payload: AuthenticatePayload,
): Promise<GenericResponse<PublicUser>> {
  return request<PublicUser>("authenticate", payload);
}

export async function register(
  payload: RegisterPayload,
): Promise<GenericResponse<[]>> {
  return request<[]>("register", payload);
}

export async function resendVerification(): Promise<GenericResponse<[]>> {
  return request<[]>("resend-verification", {});
}

export async function verifyEmail(
  token: string,
): Promise<GenericResponse<VerifyEmailResponse>> {
  return request<VerifyEmailResponse>("verify-email", { token });
}

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<GenericResponse<[]>> {
  return request<[]>("forgot-password", payload);
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<GenericResponse<[]>> {
  return request<[]>("reset-password", payload);
}

export async function logout(): Promise<GenericResponse<[]>> {
  return request<[]>("logout", {});
}

export async function logoutAll(): Promise<GenericResponse<[]>> {
  return request<[]>("logout-all", {});
}
