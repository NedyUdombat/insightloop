import { NextResponse } from "next/server";
import { prisma } from "@/api/lib/db";
import { requireAuth } from "@/api/middleware/requireAuth";
import ApiKeyService from "@/api/services/ApiKeyService";
import notificationService from "@/api/services/NotificationService";

export const POST = requireAuth(async (req) => {
  const apiKeyService = new ApiKeyService();
  const apiKeyId = req.params?.apiKeyId;
  const projectId = req.params?.projectId;

  if (!apiKeyId) {
    return NextResponse.json({ error: "Invalid api key id" }, { status: 400 });
  }

  if (!projectId) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  try {
    const newApiKey = await apiKeyService.rotateApiKey({
      apiKeyId,
      ownerId: req.user.id,
    });

    // Check if security notifications are enabled
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { securityNotifications: true },
    });

    if (project?.securityNotifications) {
      // Fire and forget - don't block the response
      notificationService
        .createSecurityNotification(
          req.user.id,
          "API Key Rotated",
          "API key was rotated. Please update your integration with the new key.",
          projectId,
        )
        .catch((err) =>
          console.error("Failed to create API key rotation notification:", err),
        );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          apiKey: newApiKey,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to rotate API key:", error);
    return NextResponse.json(
      { error: "Failed to rotate API key" },
      { status: 403 },
    );
  }
});
