import type { PrismaClient } from "@prisma/client/extension";
import { prisma } from "@/api/lib/db";
import type { IUser, PublicUser } from "@/api/types/IUser";
import type { CreateUserInput } from "@/api/validators/user";
import type { Prisma } from "@/generated/prisma/client";
import type {
  UserInclude,
  UserWhereUniqueInput,
} from "@/generated/prisma/models/User";

class UserService {
  async createUser(data: CreateUserInput): Promise<IUser> {
    return prisma.user.create({
      data,
    });
  }

  async fetchUserById({ id }: { id: string }): Promise<IUser | null> {
    return prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async fetchUserByEmail({
    email,
    include,
  }: {
    email: string;
    include?: UserInclude;
  }): Promise<IUser | null> {
    return prisma.user.findUnique({
      where: { email, deletedAt: null },
      include: include,
    });
  }

  async serializeUser(user: IUser): Promise<PublicUser> {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      role: user.role,
      emailVerified: user.emailVerified,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      projects: user.projects || [],
      lastProjectId: user.lastProjectId,
      globalNotificationsEnabled: user.globalNotificationsEnabled,
      notificationChannels: user.notificationChannels,
      quietHoursStart: user.quietHoursStart,
      quietHoursEnd: user.quietHoursEnd,
      digestFrequency: user.digestFrequency,
    } as PublicUser;
  }

  async updateUser({
    where,
    data,
    tx,
  }: {
    where: UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;
    return db.user.update({
      where,
      data,
    });
  }

  async deleteUser(id: string) {
    return prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        email: `deleted${id}`,
      },
    });
  }
}

export default UserService;
