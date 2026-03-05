import { requireAuth } from "@/api/middleware/requireAuth";
import EventService from "@/api/services/EventService";
import ProjectService from "@/api/services/ProjectService";
import { NextResponse } from "next/server";

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

    // Use assertOwnership which already implements the ownership check
    // This follows DRY principle and reuses existing business logic
    const project = await projectService.assertOwnership({
      projectId,
      userId: req.user.id,
    });

    const firstEvent = await eventService.getFirstEvent({
      projectId: project.id,
    });

    return NextResponse.json({ data: firstEvent }, { status: 200 });
  } catch (error: any) {
    // Handle errors from assertOwnership
    if (error.statusCode === 404) {
      return NextResponse.json(
        { error: error.message || "Project not found" },
        { status: 404 },
      );
    }

    // Log unexpected errors for debugging
    console.error("Failed to fetch first event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});
