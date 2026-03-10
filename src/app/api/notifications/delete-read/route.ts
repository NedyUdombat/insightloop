import { NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";
import notificationService from "@/api/services/NotificationService";

export const DELETE = requireAuth(async (req) => {
  try {
    const body = await req.json();
    const projectId = body.projectId || undefined;

    const result = await notificationService.deleteAllRead(
      req.user.id,
      projectId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "All read notifications deleted successfully",
        data: {
          count: result.count,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting read notifications:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete read notifications",
      },
      { status: 500 },
    );
  }
});
