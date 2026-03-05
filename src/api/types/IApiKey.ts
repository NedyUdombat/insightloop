import type { IModel } from "@/api/types/IModel";
import type { IProject } from "@/api/types/IProject";
import type { IUser } from "@/api/types/IUser";
import type { ApiKeyType, Environment } from "@/generated/prisma/enums";

export interface IApiKey extends IModel {
  name: string;
  keyHash: string;
  projectId: string;
  project: IProject | null;
  createdById: string;
  createdBy: IUser | null;
  revokedAt: Date | null;
  rotatedAt: Date | null;
  environment: Environment;
  type: ApiKeyType;
  keyHint: string;
  keyValue?: string; // Only included when the key is first created
  lastUsedAt: Date | null;
}
