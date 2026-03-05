import type { IUser } from "@/api/types/IUser";
import type { IModel } from "./IModel";

export interface IAuditLog extends IModel {
  userId: string;
  user: IUser | null;
  action: string;
  userAgent: string | null;
  ip: string | null;
  metadata: Record<string, unknown> | null;
}
