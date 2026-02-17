import { IModel } from "@/api/types/IModel";
import { IProject } from "@/api/types/IProject";
import type { IUser } from "@/api/types/IUser";

export interface IApiKey extends IModel {
  name: string;
  keyHash: string;
  projectId: string;
  project: IProject | null;
  createdById: string;
  createdBy: IUser | null;
}
