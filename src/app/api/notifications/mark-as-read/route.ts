import { NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";
import notificationService from "@/api/services/NotificationService";

export const PATCH = requireAuth(async (req) => {
  try {
    const body = await req.json();
    const { notificationIds } = body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        {
          success: false,
          error: "notificationIds must be an array",
        },
        { status: 400 },
      );
    }

    if (notificationIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "notificationIds cannot be empty",
        },
        { status: 400 },
      );
    }

    const result = await notificationService.markMultipleAsRead(
      notificationIds,
      req.user.id,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Notifications marked as read",
        data: {
          count: result.count,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error marking multiple notifications as read:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to mark notifications as read",
      },
      { status: 500 },
    );
  }
});
