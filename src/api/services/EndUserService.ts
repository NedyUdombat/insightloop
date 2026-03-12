import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client/extension";
import { prisma } from "@/api/lib/db";
import type { EndUser } from "@/generated/prisma/client";

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
}

export default EndUserService;
