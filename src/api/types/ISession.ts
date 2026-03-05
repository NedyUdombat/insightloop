import type { IUser } from "@/api/types/IUser";
import type { IModel } from "./IModel";

export interface ISession extends IModel {
  userId: string;
  user: IUser | null;
  revokedAt: Date | null;
  expiresAt: Date | null;
  userAgent: string | null;
  ip: string | null;
  sessionId: string | null;
  csrfToken: string | null;
  maxExpiresAt: Date | null;
}
