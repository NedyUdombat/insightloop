import { NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";
import notificationService from "@/api/services/NotificationService";

export const GET = requireAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;

    const count = await notificationService.getUnreadCount(
      req.user.id,
      projectId,
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          count,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch unread count",
      },
      { status: 500 },
    );
  }
});
