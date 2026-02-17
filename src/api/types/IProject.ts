import { type IModel } from "./IModel";
import { type IUser } from "./IUser";

export interface IProject extends IModel {
  name: string;
  createdById: string;
  owner: IUser | null;
  ownerId: string;
}
