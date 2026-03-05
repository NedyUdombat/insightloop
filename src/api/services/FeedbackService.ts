import { prisma } from "@/api/lib/db";
import type { Environment, FeedbackStatus } from "@/generated/prisma/enums";
import type { PrismaClient } from "@prisma/client/extension";

class FeedbackService {
  async createFeedback({
    projectId,
    endUserId,
    message,
    environment,
    metadata,
    tx,
  }: {
    projectId: string;
    endUserId: string;
    message: string;
    environment: Environment;
    metadata?: Record<string, any>;
    tx?: PrismaClient;
  }) {
    const db = tx ?? prisma;

    return db.feedback.create({
      data: {
        projectId,
        endUserId,
        metadata,
        message,
        environment,
      },
    });
  }

  async getFeedbacks({
    projectId,
    page = 1,
    limit = 25,
    search,
    status,
    environment,
    rating,
    endUserId,
  }: {
    projectId: string;
    page?: number;
    limit?: number;
    search?: string;
    status?: FeedbackStatus;
    environment?: Environment;
    rating?: number;
    endUserId?: string;
  }) {
    const skip = (page - 1) * limit;

    const where = {
      projectId,
      deletedAt: null,
      ...(status && { status }),
      ...(environment && { environment }),
      ...(rating && { rating }),
      ...(endUserId && { endUserId }),
      ...(search && {
        OR: [
          { message: { contains: search, mode: "insensitive" as const } },
          {
            endUser: {
              OR: [
                { email: { contains: search, mode: "insensitive" as const } },
                { name: { contains: search, mode: "insensitive" as const } },
                { externalUserId: { contains: search, mode: "insensitive" as const } },
              ],
            },
          },
        ],
      }),
    };

    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        include: {
          endUser: {
            select: {
              id: true,
              name: true,
              email: true,
              externalUserId: true,
            },
          },
        },
        orderBy: { feedbackTimestamp: "desc" },
        skip,
        take: limit,
      }),
      prisma.feedback.count({ where }),
    ]);

    const hasMore = skip + feedbacks.length < total;

    return {
      feedbacks,
      total,
      page,
      limit,
      hasMore,
    };
  }

  async getFeedbackById({
    feedbackId,
    projectId,
  }: {
    feedbackId: string;
    projectId: string;
  }) {
    const feedback = await prisma.feedback.findFirst({
      where: {
        id: feedbackId,
        projectId,
        deletedAt: null,
      },
      include: {
        endUser: {
          select: {
            id: true,
            name: true,
            email: true,
            externalUserId: true,
          },
        },
      },
    });

    return feedback;
  }

  async updateFeedbackStatus({
    feedbackId,
    projectId,
    status,
  }: {
    feedbackId: string;
    projectId: string;
    status: FeedbackStatus;
  }) {
    // First verify the feedback belongs to the project
    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        id: feedbackId,
        projectId,
        deletedAt: null,
      },
    });

    if (!existingFeedback) {
      throw new Error("Feedback not found");
    }

    return prisma.feedback.update({
      where: { id: feedbackId },
      data: { status },
      include: {
        endUser: {
          select: {
            id: true,
            name: true,
            email: true,
            externalUserId: true,
          },
        },
      },
    });
  }

  serializeFeedback(feedback: any) {
    return {
      id: feedback.id,
      rating: feedback.rating,
      title: feedback.title,
      message: feedback.message,
      additionalInfo: feedback.additionalInfo,
      status: feedback.status,
      properties: feedback.properties,
      metadata: feedback.metadata,
      environment: feedback.environment,
      createdAt: feedback.createdAt.toISOString(),
      updatedAt: feedback.updatedAt.toISOString(),
      endUser: feedback.endUser
        ? {
            id: feedback.endUser.id,
            name: feedback.endUser.name,
            email: feedback.endUser.email,
            externalUserId: feedback.endUser.externalUserId,
          }
        : null,
    };
  }
}

export default FeedbackService;
