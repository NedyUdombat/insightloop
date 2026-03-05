import { request } from "../helpers/request";
import type {
  CreateApiKeyPayload,
  CreateApiKeyResponse,
  GetApiKeysResponse,
  RevokeApiKeyPayload,
  RotateApiKeyPayload,
  RotateApiKeyResponse,
} from "./types";

export async function getApiKeys(
  projectId: string,
): Promise<GenericResponse<GetApiKeysResponse>> {
  return request<GetApiKeysResponse>("GET", `/projects/${projectId}/api-keys`);
}

export async function createApiKey(
  payload: CreateApiKeyPayload,
): Promise<GenericResponse<CreateApiKeyResponse>> {
  const { projectId, ...body } = payload;
  return request<CreateApiKeyResponse>(
    "POST",
    `/projects/${projectId}/api-keys`,
    body,
  );
}

export async function revokeApiKey(
  payload: RevokeApiKeyPayload,
): Promise<GenericResponse<{ success: boolean }>> {
  const { projectId, apiKeyId } = payload;
  return request<{ success: boolean }>(
    "DELETE",
    `/projects/${projectId}/api-keys/${apiKeyId}/revoke`,
  );
}

export async function rotateApiKey(
  payload: RotateApiKeyPayload,
): Promise<GenericResponse<RotateApiKeyResponse>> {
  const { projectId, apiKeyId } = payload;
  return request<RotateApiKeyResponse>(
    "POST",
    `/projects/${projectId}/api-keys/${apiKeyId}/rotate`,
  );
}
