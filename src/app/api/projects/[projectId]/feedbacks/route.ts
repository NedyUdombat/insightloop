import { NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";
import FeedbackService from "@/api/services/FeedbackService";
import ProjectService from "@/api/services/ProjectService";
import { Environment, FeedbackStatus } from "@/generated/prisma/enums";

export const GET = requireAuth(async (req) => {
  try {
    const projectId = req.params?.projectId;

    if (!projectId) {
      return NextResponse.json(
        { error: "Invalid project id" },
        { status: 400 },
      );
    }

    const projectService = new ProjectService();
    const feedbackService = new FeedbackService();

    // Verify ownership
    const project = await projectService.assertOwnership({
      projectId,
      userId: req.user.id,
    });

    // Parse query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const search = searchParams.get("search") || undefined;
    const statusParam = searchParams.get("status") || undefined;
    const environmentParam = searchParams.get("environment") || undefined;
    const ratingParam = searchParams.get("rating") || undefined;
    const endUserId = searchParams.get("endUserId") || undefined;

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 },
      );
    }

    // Validate status if provided
    let status: FeedbackStatus | undefined;
    if (statusParam) {
      if (
        !Object.values(FeedbackStatus).includes(statusParam as FeedbackStatus)
      ) {
        return NextResponse.json(
          { error: "Invalid status parameter" },
          { status: 400 },
        );
      }
      status = statusParam as FeedbackStatus;
    }

    // Validate environment if provided
    let environment: Environment | undefined;
    if (environmentParam) {
      if (
        !Object.values(Environment).includes(environmentParam as Environment)
      ) {
        return NextResponse.json(
          { error: "Invalid environment parameter" },
          { status: 400 },
        );
      }
      environment = environmentParam as Environment;
    }

    // Validate rating if provided
    let rating: number | undefined;
    if (ratingParam) {
      const ratingNum = parseInt(ratingParam, 10);
      if (Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return NextResponse.json(
          { error: "Invalid rating parameter (must be 1-5)" },
          { status: 400 },
        );
      }
      rating = ratingNum;
    }

    const result = await feedbackService.getFeedbacks({
      projectId: project.id,
      page,
      limit,
      search,
      status,
      environment,
      rating,
      endUserId,
    });

    // Serialize feedbacks
    const serializedFeedbacks = result.feedbacks.map((feedback) =>
      feedbackService.serializeFeedback(feedback),
    );

    return NextResponse.json(
      {
        data: serializedFeedbacks,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          hasMore: result.hasMore,
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "statusCode" in error &&
      error.statusCode === 404
    ) {
      return NextResponse.json(
        {
          error:
            ("message" in error && typeof error.message === "string"
              ? error.message
              : null) || "Project not found",
        },
        { status: 404 },
      );
    }

    console.error("Failed to fetch feedbacks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});
