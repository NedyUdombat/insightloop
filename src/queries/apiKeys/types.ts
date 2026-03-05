import type { IApiKey } from "@/api/types/IApiKey";
import type { ApiKeyType, Environment } from "@/generated/prisma/enums";

export interface CreateApiKeyPayload {
  name: string;
  type: ApiKeyType;
  environment: Environment;
  projectId: string;
}

export interface CreateApiKeyResponse {
  apiKey: {
    value: string;
    type: ApiKeyType;
    environment: Environment;
    name: string;
  };
  hint: string;
}

export interface GetApiKeysResponse {
  apiKeys: IApiKey[];
}

export interface RevokeApiKeyPayload {
  apiKeyId: string;
  projectId: string;
}

export interface RotateApiKeyPayload {
  apiKeyId: string;
  projectId: string;
}

export interface RotateApiKeyResponse {
  success: boolean;
  apiKey: string;
}
