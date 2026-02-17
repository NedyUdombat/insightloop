import { PrismaClient } from "@prisma/client/extension";
import { prisma } from "@/api/lib/db";

class FeedbackService {
  async createFeedback({
    projectId,
    endUserId,
    message,
    metadata,
    tx,
  }: {
    projectId: string;
    endUserId: string;
    message: string;
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
      },
    });
  }
}

export default FeedbackService;
