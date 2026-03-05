import type { IModel } from "./IModel";
import type { IUser } from "./IUser";

export interface IFeedback extends IModel {
  projectId: string;
  name: string;
  createdById: string;
  createdBy: IUser | null;
}
