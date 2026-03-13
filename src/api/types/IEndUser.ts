import type { IModel } from "./IModel";
import type { IProject } from "./IProject";

export interface IEndUser extends IModel {
  firstName: string;
  lastName: string;
  email: string;
  projectId: string;
  project: IProject | null;
  externalUserId: string | null;
  traits?: Record<string, any> | null;
  anonymousId: string;
}

