import { NextResponse } from "next/server";
import { prisma } from "@/api/lib/db";
import { requireAuth } from "@/api/middleware/requireAuth";
import ApiKeyService from "@/api/services/ApiKeyService";
import AuditService from "@/api/services/AuditService";
import ProjectService from "@/api/services/ProjectService";
import notificationService from "@/api/services/NotificationService";
import {
  type UpdateProjectInput,
  UpdateProjectSchema,
} from "@/api/validators/project";

export const GET = requireAuth(async (req) => {
  const projectService = new ProjectService();

  const projectId = req.params?.projectId;

  if (!projectId) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  const project = await projectService.findProject({
    where: {
      id: projectId,
      ownerId: req.user.id,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      ownerId: true,
      eventNotifications: true,
      feedbackNotifications: true,
      systemNotifications: true,
      securityNotifications: true,
      autoArchive: true,
      retentionDays: true,
      defaultEnvironment: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      apiKeys: {
        where: {
          revokedAt: null,
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          revokedAt: true,
          deletedAt: true,
          keyValue: true,
          keyHint: true,
          type: true,
        },
      },
      _count: {
        select: {
          events: true,
          feedbacks: true,
        },
      },
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // ✅ Serialize before returning
  const serializedProject = await projectService.serializeProject(project);

  return NextResponse.json({ data: serializedProject }, { status: 200 });
});

export const PATCH = requireAuth(async (req) => {
  const projectService = new ProjectService();
  const auditService = new AuditService();

  const projectId = req.params?.projectId;

  if (!projectId) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  const reqBody = await req.json();

  const validatedData = UpdateProjectSchema.safeParse(reqBody);
  if (!validatedData.success) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 },
    );
  }

  const validatedProjectData = validatedData.data;

  const updateData: UpdateProjectInput = {} as UpdateProjectInput;

  // Add fields to update data if they are present
  if (validatedProjectData.name !== undefined) {
    updateData.name = validatedProjectData.name;
  }
  if (validatedProjectData.eventNotifications !== undefined) {
    updateData.eventNotifications = validatedProjectData.eventNotifications;
  }
  if (validatedProjectData.feedbackNotifications !== undefined) {
    updateData.feedbackNotifications = validatedProjectData.feedbackNotifications;
  }
  if (validatedProjectData.systemNotifications !== undefined) {
    updateData.systemNotifications = validatedProjectData.systemNotifications;
  }
  if (validatedProjectData.securityNotifications !== undefined) {
    updateData.securityNotifications = validatedProjectData.securityNotifications;
  }
  if (validatedProjectData.autoArchive !== undefined) {
    updateData.autoArchive = validatedProjectData.autoArchive;
  }
  if (validatedProjectData.retentionDays !== undefined) {
    updateData.retentionDays = validatedProjectData.retentionDays;
  }
  if (validatedProjectData.defaultEnvironment !== undefined) {
    updateData.defaultEnvironment = validatedProjectData.defaultEnvironment;
  }

  // Check if there's anything to update
  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    let shouldNotify = false;
    let updatedFields: string[] = [];

    const updatedProject = await prisma.$transaction(async (tx) => {
      const project = await projectService.assertOwnership({
        projectId,
        userId: req.user.id,
        tx,
      });

      shouldNotify = project.systemNotifications;
      updatedFields = Object.keys(updateData);

      const updated = await projectService.updateProject({
        where: { id: project.id },
        data: updateData,
        tx,
      });

      // Log general project update
      await auditService.audit({
        action: "PROJECT_UPDATED",
        userId: req.user.id,
        metadata: {
          projectId,
          updatedFields,
        },
        tx,
      });

      // Log specific environment change if defaultEnvironment was updated
      if (updateData.defaultEnvironment !== undefined) {
        await auditService.audit({
          action: "PROJECT_ENVIRONMENT_CHANGED",
          userId: req.user.id,
          metadata: {
            projectId,
            oldEnvironment: project.defaultEnvironment,
            newEnvironment: updateData.defaultEnvironment,
          },
          tx,
        });
      }

      return updated;
    });

    // Create notification after transaction completes (if enabled)
    if (shouldNotify) {
      const changedFields = updatedFields
        .map((field) => field.replace(/([A-Z])/g, " $1").toLowerCase())
        .join(", ");

      // Fire and forget - don't block the response
      notificationService
        .createProjectNotification(
          req.user.id,
          projectId,
          "Project Settings Updated",
          `Project settings were updated: ${changedFields}`,
        )
        .catch((err) =>
          console.error("Failed to create project update notification:", err),
        );
    }

    const serialized = projectService.serializeProject(updatedProject);

    return NextResponse.json({ data: serialized }, { status: 200 });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
    ) {
      return NextResponse.json(
        {
          error:
            "message" in error && typeof error.message === "string"
              ? error.message
              : "An error occurred",
        },
        { status: error.statusCode },
      );
    }

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Project name already exists." },
        { status: 409 },
      );
    }

    console.error("Update project failed", error);

    return NextResponse.json(
      { error: "Unable to update project" },
      { status: 500 },
    );
  }
});

export const DELETE = requireAuth(async (req) => {
  const projectService = new ProjectService();
  const auditService = new AuditService();
  const apiKeyService = new ApiKeyService();

  const projectId = req.params?.projectId;

  if (!projectId) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  try {
    let projectName = "";
    let shouldNotify = false;

    await prisma.$transaction(async (tx) => {
      const project = await projectService.assertOwnership({
        projectId,
        userId: req.user.id,
        tx,
      });

      projectName = project.name;
      shouldNotify = project.systemNotifications;

      await projectService.deleteProject({
        id: project.id,
        ownerId: req.user.id,
        tx,
      });

      await apiKeyService.updateManyApiKeys({
        where: { projectId, revokedAt: null },
        data: { revokedAt: new Date() },
        tx,
      });

      await auditService.audit({
        action: "PROJECT_DELETED",
        userId: req.user.id,
        metadata: { projectId: project.id },
        tx,
      });
    });

    // Create notification after transaction completes (if enabled)
    // Note: This will still create the notification even though the project is deleted
    // because it's tied to the user, not the project (projectId will be null for deleted projects)
    if (shouldNotify) {
      // Fire and forget - don't block the response
      notificationService
        .createProjectNotification(
          req.user.id,
          projectId,
          "Project Deleted",
          `Project "${projectName}" has been deleted`,
          "WARNING" as any,
        )
        .catch((err) =>
          console.error("Failed to create project deletion notification:", err),
        );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "statusCode" in err &&
      typeof err.statusCode === "number"
    ) {
      return NextResponse.json(
        {
          error:
            "message" in err && typeof err.message === "string"
              ? err.message
              : "An error occurred",
        },
        { status: err.statusCode },
      );
    }

    console.error("Project delete failed:", err);

    return NextResponse.json(
      { error: "Unable to delete project" },
      { status: 500 },
    );
  }
});
