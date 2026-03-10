import { NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";
import { prisma } from "@/api/lib/db";
import ApiKeyService from "@/api/services/ApiKeyService";
import ProjectService from "@/api/services/ProjectService";
import notificationService from "@/api/services/NotificationService";

export const DELETE = requireAuth(async (req) => {
  const apiKeyService = new ApiKeyService();
  const projectService = new ProjectService();
  const apiKeyId = req.params?.apiKeyId;
  const projectId = req.params?.projectId;

  if (!apiKeyId) {
    return NextResponse.json({ error: "Invalid api key id" }, { status: 400 });
  }

  if (!projectId) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  try {
    await apiKeyService.revokeApiKey({
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
          "API Key Revoked",
          "An API key was revoked",
          projectId,
        )
        .catch((err) =>
          console.error("Failed to create API key revoke notification:", err),
        );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to revoke API key:", error);
    return NextResponse.json(
      { error: "Failed to revoke API key" },
      { status: 403 },
    );
  }
});
