import { IEndUser } from "./IEndUser";
import { type IModel } from "./IModel";
import { type IProject } from "./IProject";
import { type IUser } from "./IUser";

export interface IEvent extends IModel {
  eventName: string;
  eventTimestamp: Date;
  projectId: string;
  project: IProject | null;
  createdById: string;
  createdBy: IUser | null;
  metadata: Record<string, any> | null;
  properties: Record<string, any> | null;
  endUserId: string;
  endUser: IEndUser | null;
}
