import { type IModel } from "./IModel";
import { UserRole } from "@/generated/prisma/enums";

export interface IUser extends IModel {
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  password: string;
  bannedReason: string | null;
  bannedAt: Date | null;
  emailVerified: boolean | null;
  previousHashes: string[];
  loginFails: number | null;
  accountLock: Date | null;
  lastAccessed: Date | null;
}

export interface PublicUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  emailVerified: boolean | null;
}
