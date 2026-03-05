import { NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";
import FeedbackService from "@/api/services/FeedbackService";
import ProjectService from "@/api/services/ProjectService";
import { FeedbackStatus } from "@/generated/prisma/enums";

export const GET = requireAuth(async (req) => {
  try {
    const projectId = req.params?.projectId;
    const feedbackId = req.params?.feedbackId;

    if (!projectId || !feedbackId) {
      return NextResponse.json(
        { error: "Invalid project or feedback id" },
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

    const feedback = await feedbackService.getFeedbackById({
      feedbackId,
      projectId: project.id,
    });

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { data: feedbackService.serializeFeedback(feedback) },
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

    console.error("Failed to fetch feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});

export const PATCH = requireAuth(async (req) => {
  try {
    const projectId = req.params?.projectId;
    const feedbackId = req.params?.feedbackId;

    if (!projectId || !feedbackId) {
      return NextResponse.json(
        { error: "Invalid project or feedback id" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { status } = body;

    // Validate status
    if (!status || !Object.values(FeedbackStatus).includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
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

    const updatedFeedback = await feedbackService.updateFeedbackStatus({
      feedbackId,
      projectId: project.id,
      status,
    });

    return NextResponse.json(
      { data: feedbackService.serializeFeedback(updatedFeedback) },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Feedback not found") {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 },
      );
    }

    if (error.statusCode === 404) {
      return NextResponse.json(
        { error: error.message || "Project not found" },
        { status: 404 },
      );
    }

    console.error("Failed to update feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});
