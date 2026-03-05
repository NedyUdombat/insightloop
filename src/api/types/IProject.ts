import type { Environment } from "@/generated/prisma/enums";
import type { IApiKey } from "./IApiKey";
import type { IModel } from "./IModel";
import type { IUser } from "./IUser";

export interface IProject extends IModel {
  name: string;
  owner: IUser | null;
  ownerId: string;
  emailNotifications: boolean;
  eventAlerts: boolean;
  weeklyReports: boolean;
  autoArchive: boolean;
  retentionDays: number;
  defaultEnvironment: Environment;
  apiKeys: IApiKey[];
  _count: {
    events: number;
    feedbacks: number;
  };
}

export interface PublicProject {
  id: string;
  name: string;
  ownerId: string;
  emailNotifications: boolean;
  eventAlerts: boolean;
  weeklyReports: boolean;
  autoArchive: boolean;
  retentionDays: number;
  defaultEnvironment: Environment;
  createdAt: Date;
  updatedAt: Date;
  apiKeys: IApiKey[];
  eventsCount: number;
  feedbackCount: number;
}
