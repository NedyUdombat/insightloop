import { NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";
import notificationService from "@/api/services/NotificationService";

export const PATCH = requireAuth(async (req) => {
  try {
    const body = await req.json();
    const projectId = body.projectId || undefined;

    const result = await notificationService.markAllAsRead(
      req.user.id,
      projectId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "All notifications marked as read",
        data: {
          count: result.count,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to mark all notifications as read",
      },
      { status: 500 },
    );
  }
});
