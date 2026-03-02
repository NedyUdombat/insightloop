import type { IApiKey } from "./IApiKey";
import type { IModel } from "./IModel";
import type { IUser } from "./IUser";

export interface IProject extends IModel {
  name: string;
  owner: IUser | null;
  ownerId: string;
  apiKeys: IApiKey[];
}

export interface PublicProject {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  apiKeys: IApiKey[];
}
