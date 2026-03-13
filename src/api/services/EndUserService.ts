import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client/extension";
import { prisma } from "@/api/lib/db";
import type { EndUser } from "@/generated/prisma/client";
import type { EndUserWhereInput } from "@/generated/prisma/models/EndUser";
import type { IEndUser } from "../types/IEndUser";

class EndUserService {
  async identify({
    projectId,
    userId,
    email,
    firstName,
    lastName,
    traits,
    tx,
  }: {
    projectId: string;
    userId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    traits?: Record<string, any>;
    tx?: Prisma.TransactionClient;
  }) {
    const db = tx ?? prisma;

    return db.endUser.upsert({
      where: {
        project_external_user_unique: {
          projectId,
          externalUserId: userId,
        },
      },
      create: {
        projectId,
        externalUserId: userId,
        anonymousId: userId,
        email: email ?? "",
        firstName: firstName ?? "",
        lastName: lastName ?? "",
        traits: traits ?? null,
      },
      update: {
        // Update all fields EXCEPT externalUserId and anonymousId
        email: email ?? undefined,
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
        traits: traits ?? undefined,
      },
    });
  }

  async resolveEndUser({
    projectId,
    externalUserId,
    email,
    firstName,
    lastName,
    traits,
    tx,
  }: {
    projectId: string;
    externalUserId?: string | null;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    traits?: Record<string, any>;
    tx?: Prisma.TransactionClient;
  }) {
    const db = tx ?? prisma;
    if (!externalUserId) {
      return this.createEndUser({
        projectId,
        externalUserId: null,
        email,
        firstName,
        lastName,
        traits,
        tx: db,
      });
    }

    return db.endUser.upsert({
      where: {
        project_external_user_unique: {
          projectId,
          externalUserId,
        },
      },
      create: {
        projectId,
        externalUserId,
        anonymousId: randomUUID(),
        email: email ?? "",
        firstName: firstName ?? "",
        lastName: lastName ?? "",
        traits: traits ?? null,
      },
      update: {
        email: email ?? undefined,
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
        traits: traits ?? undefined,
      },
    });
  }

  async createEndUser({
    projectId,
    externalUserId,
    email,
    firstName,
    lastName,
    traits,
    tx,
  }: {
    projectId: string;
    externalUserId: string | null;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    traits?: Record<string, any>;
    tx?: Prisma.TransactionClient;
  }) {
    const db = tx ?? prisma;

    return db.endUser.create({
      data: {
        projectId,
        externalUserId,
        anonymousId: randomUUID(),
        email: email ?? "",
        firstName: firstName ?? "",
        lastName: lastName ?? "",
        traits: traits ?? null,
      },
    });
  }

  async findOrCreateEndUser({
    projectId,
    externalUserId,
    tx,
  }: {
    projectId: string;
    externalUserId: string | null;
    tx: Prisma.TransactionClient;
  }): Promise<EndUser> {
    // Step 1: Find or create EndUser
    let endUser: EndUser;

    if (!externalUserId) {
      // No userId provided - create a new anonymous EndUser
      endUser = await tx.endUser.create({
        data: {
          projectId: projectId,
          externalUserId: null,
          anonymousId: randomUUID(),
          email: "",
          firstName: "",
          lastName: "",
          traits: {},
        },
      });
    } else {
      // Step 1a: Check if EndUser with this externalUserId already exists
      const existingEndUser = await tx.endUser.findUnique({
        where: {
          project_external_user_unique: {
            projectId: projectId,
            externalUserId,
          },
        },
      });

      if (existingEndUser) {
        // Step 1b: Use existing EndUser
        endUser = existingEndUser;
      } else {
        // Step 1c: Create new EndUser with the externalUserId
        endUser = await tx.endUser.create({
          data: {
            projectId: projectId,
            externalUserId,
            anonymousId: randomUUID(),
            email: "",
            firstName: "",
            lastName: "",
            traits: {},
          },
        });
      }
    }

    return endUser;
  }

  async getEndUsers({
    projectId,
    page = 1,
    limit = 25,
    search,
  }: {
    projectId: string;
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const skip = (page - 1) * limit;

    const whereClause: EndUserWhereInput = {
      projectId,
      deletedAt: null,
    };

    if (search) {
      whereClause.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { externalUserId: { contains: search, mode: "insensitive" } },
      ];
    }

    const [endUsers, total] = await Promise.all([
      prisma.endUser.findMany({
        where: whereClause,
        skip,
        take: limit + 1,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          anonymousId: true,
          firstName: true,
          lastName: true,
          email: true,
          externalUserId: true,
          traits: true,
          createdAt: true,
          updatedAt: true,
          projectId: true,
        },
      }),
      prisma.endUser.count({ where: whereClause }),
    ]);

    const hasMore = endUsers.length > limit;
    const items = hasMore ? endUsers.slice(0, limit) : endUsers;

    return {
      endUsers: items as IEndUser[],
      total,
      hasMore,
      page,
      limit,
    };
  }

  serializeEndUser(endUser: IEndUser) {
    return {
      id: endUser.id,
      anonymousId: endUser.anonymousId,
      firstName: endUser.firstName,
      lastName: endUser.lastName,
      email: endUser.email,
      externalUserId: endUser.externalUserId,
      traits: endUser.traits,
      projectId: endUser.projectId,
      createdAt: endUser.createdAt.toISOString(),
      updatedAt: endUser.updatedAt.toISOString(),
    };
  }
}

export default EndUserService;
