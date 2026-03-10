import { NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";
import notificationService from "@/api/services/NotificationService";
import { UpdateNotificationPreferencesSchema } from "@/api/validators/user";

export const GET = requireAuth(async (req) => {

  try {
    const preferences = await notificationService.getPreferences(req.user.id);

    return NextResponse.json({ data: preferences }, { status: 200 });
  } catch (error: unknown) {
    console.error("Get notification preferences failed:", error);
    return NextResponse.json(
      { error: "Unable to fetch notification preferences" },
      { status: 500 },
    );
  }
});

export const PATCH = requireAuth(async (req) => {
  const reqBody = await req.json();

  const validatedData = UpdateNotificationPreferencesSchema.safeParse(reqBody);
  if (!validatedData.success) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 },
    );
  }

  try {
    const updateData: any = {
      ...validatedData.data,
    };

    if (validatedData.data.quietHoursStart !== undefined) {
      updateData.quietHoursStart = validatedData.data.quietHoursStart
        ? new Date(validatedData.data.quietHoursStart)
        : undefined;
    }

    if (validatedData.data.quietHoursEnd !== undefined) {
      updateData.quietHoursEnd = validatedData.data.quietHoursEnd
        ? new Date(validatedData.data.quietHoursEnd)
        : undefined;
    }

    const updatedPreferences = await notificationService.updatePreferences(
      req.user.id,
      updateData,
    );

    return NextResponse.json({ data: updatedPreferences }, { status: 200 });
  } catch (error: unknown) {
    console.error("Update notification preferences failed:", error);
    return NextResponse.json(
      { error: "Unable to update notification preferences" },
      { status: 500 },
    );
  }
});
