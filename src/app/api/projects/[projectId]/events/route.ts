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

    // Parse query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const search = searchParams.get("search") || undefined;
    const eventName = searchParams.get("eventName") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const endUserId = searchParams.get("endUserId") || undefined;

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 },
      );
    }

    const result = await eventService.getEvents({
      projectId: project.id,
      page,
      limit,
      search,
      eventName,
      startDate,
      endDate,
      endUserId,
    });

    // Serialize events
    const serializedEvents = result.events.map((event) =>
      eventService.serializeEvent(event),
    );

    return NextResponse.json(
      {
        data: serializedEvents,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          hasMore: result.hasMore,
        },
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

    console.error("Failed to fetch events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});
