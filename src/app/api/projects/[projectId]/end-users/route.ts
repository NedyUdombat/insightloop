import { NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";
import EndUserService from "@/api/services/EndUserService";
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
    const endUserService = new EndUserService();

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

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 },
      );
    }

    const result = await endUserService.getEndUsers({
      projectId: project.id,
      page,
      limit,
      search,
    });

    // Serialize end users
    const serializedEndUsers = result.endUsers.map((endUser) =>
      endUserService.serializeEndUser(endUser),
    );

    return NextResponse.json(
      {
        data: serializedEndUsers,
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

    console.error("Failed to fetch end users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
});
