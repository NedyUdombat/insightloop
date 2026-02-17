import { prisma } from "@/api/lib/db";
import { IUser, PublicUser } from "@/api/types/IUser";
import { CreateUserInput } from "@/api/validators/user";
import { UserWhereUniqueInput } from "@/generated/prisma/models/User";

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

  async fetchUserByEmail(email: string): Promise<IUser | null> {
    return prisma.user.findUnique({
      where: { email, deletedAt: null },
    });
  }

  async serializeUser(user: IUser): Promise<PublicUser> {
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as PublicUser;
  }

  async updateUser({
    where,
    data,
  }: {
    where: UserWhereUniqueInput;
    data: any;
  }) {
    return prisma.user.update({
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
