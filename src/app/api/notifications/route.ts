import { NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";
import notificationService from "@/api/services/NotificationService";
import type {
  NotificationStatus,
  NotificationType,
} from "@/generated/prisma/enums";

export const GET = requireAuth(async (req) => {
  try {
    const projectId = req.params?.projectId;
    const { searchParams } = new URL(req.url);

    // Extract query parameters
    // const projectId = searchParams.get("projectId") || undefined;
    const readParam = searchParams.get("read");
    const read = readParam ? readParam === "true" : undefined;
    const type = searchParams.get("type") as NotificationType | undefined;
    const status = searchParams.get("status") as NotificationStatus | undefined;
    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    const limit = limitParam ? parseInt(limitParam, 10) : 50;
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0;
    const startDate = startDateParam ? new Date(startDateParam) : undefined;
    const endDate = endDateParam ? new Date(endDateParam) : undefined;

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
