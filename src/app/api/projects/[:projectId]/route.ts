import { requireAuth } from "@/api/middleware/requireAuth";
import ProjectService from "@/api/services/ProjectService";
import { NextResponse } from "next/server";
import {
  CreateProjectInput,
  CreateProjectSchema,
} from "@/api/validators/project";
import AuditService from "@/api/services/AuditService";
import { prisma } from "@/api/lib/db";
import ApiKeyService from "@/api/services/ApiKeyService";

export const GET = requireAuth(async (req, ctx: any) => {
  const projectService = new ProjectService();

  const params = req.params;
  const projectId = params[":projectId"];

  if (!projectId) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  const project = await projectService.findProjectById({
    where: {
      id: projectId,
      ownerId: req.user.id,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ data: project }, { status: 200 });
});

export const PATCH = requireAuth(async (req, ctx: any) => {
  const projectService = new ProjectService();
  const auditService = new AuditService();

  const { params } = req;
  const projectId = params[":projectId"];

  if (!projectId) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  const project = await projectService.findProjectById({
    where: {
      id: projectId,
      ownerId: req.user.id,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const reqBody = await req.json();

  const validatedData = CreateProjectSchema.safeParse(reqBody);
  if (!validatedData.success) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 },
    );
  }

  const validatedProjectData = validatedData.data;

  const updateData: CreateProjectInput = {} as CreateProjectInput;

  if (validatedProjectData.name) {
    updateData.name = validatedProjectData.name;
  }
  const updatedProject = await prisma.$transaction(async (tx) => {
    await projectService.assertOwnership({
      projectId,
      userId: req.user.id,
      tx,
    });
    return await projectService.updateProject({
      where: { id: project.id },
      data: updateData,
      tx,
    });
  });

  await auditService.audit({
    action: "PROJECT_UPDATED",
    userId: req.user.id,
    metadata: updateData,
  });
  return NextResponse.json({ data: updatedProject }, { status: 200 });
});

export const DELETE = requireAuth(async (req, ctx: any) => {
  const projectService = new ProjectService();
  const auditService = new AuditService();
  const apiKeyService = new ApiKeyService();

  const { params } = req;
  const projectId = params[":projectId"];

  if (!projectId) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await projectService.assertOwnership({
        projectId,
        userId: req.user.id,
        tx,
      });
      await projectService.deleteProject({ id: projectId, tx });

      await apiKeyService.updateManyApiKeys({
        where: { projectId },
        data: { revokedAt: new Date() },
        tx,
      });

      await auditService.audit({
        action: "PROJECT_DELETED",
        userId: req.user.id,
        metadata: { projectId },
      });
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Project Delete failed:", err);

    return NextResponse.json({ success: true }, { status: 200 });
  }
});
