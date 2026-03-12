import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client/extension";
import { prisma } from "@/api/lib/db";

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
}

export default EndUserService;
