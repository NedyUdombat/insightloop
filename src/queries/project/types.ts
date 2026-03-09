import type { PublicProject } from "@/api/types/IProject";
import type { Environment } from "@/generated/prisma/enums";

export interface CreateProjectPayload {
  name: string;
  eventNotifications?: boolean;
  feedbackNotifications?: boolean;
  systemNotifications?: boolean;
  securityNotifications?: boolean;
  autoArchive?: boolean;
  retentionDays?: number;
  defaultEnvironment?: Environment;
}

export interface CreateProjectResponse {
  project: PublicProject;
  apiKey: {
    value: string;
    environment: string;
    name: string;
  };
}

export interface CountProjectEventsResponse {
  data: number;
}

export interface GetProjectFirstEventResponse {
  eventName: string;
  eventTimestamp: Date;
  endUserId: string;
  metadata: Record<string, unknown> | null;
  properties: Record<string, unknown> | null;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  environment: string;
}

export interface UpdateProjectPayload {
  name: string;
  preferences?: {
    eventNotifications: boolean;
    feedbackNotifications: boolean;
    systemNotifications: boolean;
    securityNotifications: boolean;
    autoArchive: boolean;
    retentionDays: number;
    defaultEnvironment: Environment;
  };
  projectId: string;
}

export interface UpdateProjectResponse {
  project: PublicProject;
}

export interface DeleteProjectResponse {
  success: boolean;
}
