import { NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";
import notificationService from "@/api/services/NotificationService";

export const GET = requireAuth(async (req) => {
  try {
    const notificationId = req.params?.id;

    if (!notificationId) {
      return NextResponse.json(
        {
          success: false,
          error: "Notification ID is required",
        },
        { status: 400 },
      );
    }

    const notification = await notificationService.getById(
      notificationId,
      req.user.id,
    );

    if (!notification) {
      return NextResponse.json(
        {
          success: false,
          error: "Notification not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: notification,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching notification:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch notification",
      },
      { status: 500 },
    );
  }
});
