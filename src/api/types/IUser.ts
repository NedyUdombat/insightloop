import type { UserRole } from "@/generated/prisma/enums";
import type { IModel } from "./IModel";
import type { IProject } from "./IProject";

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
  projects?: IProject[];
  lastProjectId: string | null; // ID of the last accessed project
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
  projects?: IProject[];
  lastProjectId: string | null;
}
