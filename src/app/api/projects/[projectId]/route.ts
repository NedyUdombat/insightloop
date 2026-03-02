import { prisma } from "@/api/lib/db";
import { requireAuth } from "@/api/middleware/requireAuth";
import ApiKeyService from "@/api/services/ApiKeyService";
import AuditService from "@/api/services/AuditService";
import ProjectService from "@/api/services/ProjectService";
import {
  type UpdateProjectInput,
  UpdateProjectSchema,
} from "@/api/validators/project";
import { NextResponse } from "next/server";

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
    include: {
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

  if (!validatedProjectData.name) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const updateData: UpdateProjectInput = {} as UpdateProjectInput;

  if (validatedProjectData.name) {
    updateData.name = validatedProjectData.name;
  }

  try {
    const updatedProject = await prisma.$transaction(async (tx) => {
      const project = await projectService.assertOwnership({
        projectId,
        userId: req.user.id,
        tx,
      });

      const updated = await projectService.updateProject({
        where: { id: project.id },
        data: updateData,
        tx,
      });

      await auditService.audit({
        action: "PROJECT_UPDATED",
        userId: req.user.id,
        metadata: {
          projectId,
          updatedFields: Object.keys(updateData),
        },
        tx,
      });

      return updated;
    });

    const serialized = projectService.serializeProject(updatedProject);

    return NextResponse.json({ data: serialized }, { status: 200 });
  } catch (error: any) {
    if (error.statusCode) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    if (error.code === "P2002") {
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
    await prisma.$transaction(async (tx) => {
      const project = await projectService.assertOwnership({
        projectId,
        userId: req.user.id,
        tx,
      });
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

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    if (err.statusCode) {
      return NextResponse.json(
        { error: err.message },
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
