import type { Environment } from "@/generated/prisma/enums";
import type { IEndUser } from "./IEndUser";
import type { IModel } from "./IModel";
import type { IProject } from "./IProject";
import type { IUser } from "./IUser";

export interface IEvent extends IModel {
  eventName: string;
  eventTimestamp: Date;
  projectId: string;
  project: IProject | null;
  createdById: string;
  createdBy: IUser | null;
  properties: Record<string, any> | null; // Developer-provided custom properties
  metadata: Record<string, any> | null; // System-generated metadata (location, device, IP, host, URL, etc.)
  endUserId: string;
  endUser: IEndUser | null;
  environment: Environment;
}

export interface PublicEvent {
  id: string;
  eventName: string;
  eventTimestamp: Date;
  projectId: string;
  properties: Record<string, any> | null; // Developer-provided custom properties
  metadata: Record<string, any> | null; // System-generated metadata
  endUserId: string;
  endUser: IEndUser | null;
  environment: Environment;
}
