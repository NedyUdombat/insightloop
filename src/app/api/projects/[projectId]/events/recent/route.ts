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

    // Verify ownership
    const project = await projectService.assertOwnership({
      projectId,
      userId: req.user.id,
    });

    // Get recent events
    const events = await eventService.getRecentEvents({
      projectId: project.id,
      limit: 10,
    });

    // Serialize events
    const serializedEvents = events.map((event) =>
      eventService.serializeEvent(event),
    );

    return NextResponse.json(
      {
        data: serializedEvents,
      },
      { status: 200 },
    );
  } catch (error: any) {
    if (error.statusCode === 404) {
      return NextResponse.json(
        { error: error.message || "Project not found" },
        { status: 404 },
      );
    }

    console.error("Failed to fetch recent events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});
