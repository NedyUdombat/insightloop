import type { UserRole, NotificationChannel, DigestFrequency } from "@/generated/prisma/enums";
import type { IModel } from "./IModel";
import type { IProject } from "./IProject";

export interface IUser extends IModel {
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  role: UserRole;
  password: string;
  bannedReason: string | null;
  bannedAt: Date | null;
  emailVerified: boolean | null;
  emailVerifiedAt: Date | null;
  previousHashes: string[];
  loginFails: number | null;
  accountLock: Date | null;
  lastAccessed: Date | null;
  projects?: IProject[];
  lastProjectId: string | null; // ID of the last accessed project

  // Notification Preferences
  globalNotificationsEnabled: boolean;
  notificationChannels: NotificationChannel[];
  quietHoursStart: Date | null;
  quietHoursEnd: Date | null;
  digestFrequency: DigestFrequency;
}

export interface PublicUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  role: UserRole;
  emailVerified: boolean | null;
  emailVerifiedAt: Date | null;
  projects?: IProject[];
  lastProjectId: string | null;

  // Notification Preferences
  globalNotificationsEnabled: boolean;
  notificationChannels: NotificationChannel[];
  quietHoursStart: Date | null;
  quietHoursEnd: Date | null;
  digestFrequency: DigestFrequency;
}
