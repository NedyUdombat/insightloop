import { NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";
import EventService from "@/api/services/EventService";
import FeedbackService from "@/api/services/FeedbackService";
import ProjectService from "@/api/services/ProjectService";

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
    const eventService = new EventService();
    const feedbackService = new FeedbackService();

    // Verify ownership
    const project = await projectService.assertOwnership({
      projectId,
      userId: req.user.id,
    });

    // Get recent events and feedback in parallel
    const [events, feedbackData] = await Promise.all([
      eventService.getRecentEvents({
        projectId: project.id,
        limit: 10,
      }),
      feedbackService.getFeedbacks({
        projectId: project.id,
        limit: 10,
        page: 1,
      }),
    ]);

    // Combine and sort by timestamp
    const activities = [
      ...events.map((event) => ({
        ...eventService.serializeEvent(event),
        type: "event" as const,
        timestamp: event.eventTimestamp.toISOString(),
      })),
      ...feedbackData.feedbacks.map((feedback) => ({
        ...feedbackService.serializeFeedback(feedback),
        type: "feedback" as const,
        timestamp: feedback.feedbackTimestamp?.toISOString() || feedback.createdAt.toISOString(),
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 10);

    return NextResponse.json(
      {
        data: activities,
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

    console.error("Failed to fetch recent activity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});
