import type { Environment, FeedbackStatus } from "@/generated/prisma/enums";

export interface GetFeedbacksParams {
  projectId: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: FeedbackStatus;
  environment?: Environment;
  rating?: number;
  endUserId?: string;
}

export interface UpdateFeedbackStatusParams {
  projectId: string;
  feedbackId: string;
  status: FeedbackStatus;
}
