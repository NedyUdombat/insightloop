import type { Environment } from "@/generated/prisma/enums";
import type { IEndUser } from "./IEndUser";
import type { IModel } from "./IModel";

export interface IEvent extends IModel {
  eventName: string;
  eventTimestamp: Date;
  projectId: string;
  properties: Record<string, unknown> | null; // Developer-provided custom properties
  metadata: Record<string, unknown> | null; // System-generated metadata (location, device, IP, host, URL, etc.)
  endUserId: string;
  endUser?: IEndUser | null;
  environment: Environment;
}

export interface PublicEvent {
  id: string;
  eventName: string;
  eventTimestamp: Date;
  projectId: string;
  properties: Record<string, unknown> | null; // Developer-provided custom properties
  metadata: Record<string, unknown> | null; // System-generated metadata
  endUserId: string;
  endUser: IEndUser | null;
  environment: Environment;
  createdAt: Date;
}
