import type { Prisma } from "@prisma/client/extension";
import { prisma } from "@/api/lib/db";
import type { IEndUser } from "../types/IEndUser";

class EndUserService {
  async resolveEndUser({
    projectId,
    externalUserId,
    email,
    name,
    tx,
  }: {
    projectId: string;
    externalUserId?: string | null;
    email?: string | null;
    name?: string | null;
    tx?: Prisma.TransactionClient;
  }) {
    const db = tx ?? prisma;
    if (!externalUserId) {
      return this.createEndUser({
        projectId,
        externalUserId: null,
        email,
        name,
        tx: db,
      });
    }

    return db.endUser.upsert({
      where: {
        projectId_externalUserId: {
          projectId,
          externalUserId,
        },
      },
      create: {
        projectId,
        externalUserId,
        email,
        name,
      },
      update: {
        email: email ?? undefined,
        name: name ?? undefined,
      },
    });
  }

  async createEndUser({
    projectId,
    externalUserId,
    email,
    name,
    tx,
  }: {
    projectId: string;
    externalUserId: string | null;
    email?: string | null;
    name?: string | null;
    tx?: Prisma.TransactionClient;
  }) {
    const db = tx ?? prisma;

    return db.endUser.create({
      data: {
        projectId,
        externalUserId,
        email,
        name,
      },
    });
  }

  async linkAnonymousToIdentified({
    projectId,
    userId,
    anonymousId,
    traits,
    tx,
  }: {
    projectId: string;
    userId: string;
    anonymousId: string;
    traits?: {
      email?: string;
      name?: string;
      [key: string]: unknown;
    };
    tx?: Prisma.TransactionClient;
  }) {
    const db = tx ?? prisma;

    // Step 1: Resolve or create the identified user
    const identifiedUser = await db.endUser.upsert({
      where: {
        projectId_externalUserId: {
          projectId,
          externalUserId: userId,
        },
      },
      create: {
        projectId,
        externalUserId: userId,
        email: traits?.email ?? null,
        name: traits?.name ?? null,
      },
      update: {
        email: traits?.email ?? undefined,
        name: traits?.name ?? undefined,
      },
    });

    // Step 2: Find anonymous EndUser(s) with this anonymousId
    // Note: There could be multiple if the anonymousId was reused after logout
    const anonymousUsers = await db.endUser.findMany({
      where: {
        projectId,
        externalUserId: anonymousId,
        deletedAt: null, // Only active anonymous users
      },
    });

    // Edge case: anonymousId and userId resolve to same EndUser (already identified)
    // Filter out the identified user itself
    const anonymousUsersToMerge = anonymousUsers.filter(
      (u: IEndUser) => u.id !== identifiedUser.id,
    );

    // If no anonymous users to merge, this is a no-op (idempotent)
    if (anonymousUsersToMerge.length === 0) {
      return {
        identifiedUser,
        mergedCount: 0,
      };
    }

    // Step 3: Link all events from anonymous users to identified user
    const anonymousUserIds = anonymousUsersToMerge.map((u: IEndUser) => u.id);

    const [eventsUpdated, feedbacksUpdated] = await Promise.all([
      db.event.updateMany({
        where: {
          endUserId: { in: anonymousUserIds },
        },
        data: {
          endUserId: identifiedUser.id,
        },
      }),
      db.feedback.updateMany({
        where: {
          endUserId: { in: anonymousUserIds },
        },
        data: {
          endUserId: identifiedUser.id,
        },
      }),
    ]);

    // Step 4: Soft-delete the anonymous EndUser records
    await db.endUser.updateMany({
      where: {
        id: { in: anonymousUserIds },
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      identifiedUser,
      mergedCount: anonymousUsersToMerge.length,
      eventsLinked: eventsUpdated.count,
      feedbacksLinked: feedbacksUpdated.count,
    };
  }
}

export default EndUserService;
