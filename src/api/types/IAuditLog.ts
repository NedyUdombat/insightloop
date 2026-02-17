import { type IModel } from "./IModel";
import { IUser } from "@/api/types/IUser";

export interface IAuditLog extends IModel {
  userId: string;
  user: IUser | null;
  action: string;
  userAgent: string | null;
  ip: string | null;
  metadata: any | null;
}
