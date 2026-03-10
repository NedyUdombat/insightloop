import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";
import notificationService from "@/api/services/NotificationService";
import { NotificationStatus, NotificationType } from "@/generated/prisma/enums";

export const GET = requireAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url);

    // Extract query parameters
    const projectId = searchParams.get("projectId") || undefined;
    const readParam = searchParams.get("read");
    const read = readParam ? readParam === "true" : undefined;
    const type = searchParams.get("type") as NotificationType | undefined;
    const status = searchParams.get("status") as NotificationStatus | undefined;
    const limit = searchParams.get("limit")
      ? Number.parseInt(searchParams.get("limit")!)
      : 50;
    const offset = searchParams.get("offset")
      ? Number.parseInt(searchParams.get("offset")!)
      : 0;
    const startDate = searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : undefined;
    const endDate = searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : undefined;

    const result = await notificationService.getNotifications({
      userId: req.user.id,
      projectId,
      read,
      type,
      status,
      limit,
      offset,
      startDate,
      endDate,
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch notifications",
      },
      { status: 500 },
    );
  }
});

export const DELETE = requireAuth(async (req) => {
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

    const result = await notificationService.deleteMultiple(
      notificationIds,
      req.user.id,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Notifications deleted successfully",
        data: {
          count: result.count,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting notifications:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete notifications",
      },
      { status: 500 },
    );
  }
});
