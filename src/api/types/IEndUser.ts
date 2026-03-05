import type { IModel } from "./IModel";
import type { IProject } from "./IProject";

export interface IEndUser extends IModel {
  name: string;
  email: string;
  projectId: string;
  project: IProject | null;
  externalUserId: string | null;
}
