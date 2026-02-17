import { NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";
import { CreateProjectSchema } from "@/api/validators/project";
import AuditService from "@/api/services/AuditService";
import ApiKeyService from "@/api/services/ApiKeyService";
import ProjectService from "@/api/services/ProjectService";
import { prisma } from "@/api/lib/db";
import { parsePagination } from "@/api/lib/pagination";

const DEFAULT_API_KEY_NAME = "Default";

export const POST = requireAuth(async (req) => {
  const auditService = new AuditService();
  const apiKeyService = new ApiKeyService();
  const projectService = new ProjectService();
  const user = req.user;

  const reqBody = await req.json();
  const validatedData = CreateProjectSchema.safeParse(reqBody);
  if (!validatedData.success) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 },
    );
  }

  const { name } = validatedData.data;
  try {
    const { raw, hash } = await apiKeyService.generateApiKey();

    const result = await prisma.$transaction(async (tx) => {
      const project = await projectService.createProject({
        name,
        ownerId: req.user.id,
        createdById: req.user.id,
        tx,
      });

      await apiKeyService.createApiKey({
        name: DEFAULT_API_KEY_NAME,
        projectId: project.id,
        keyHash: hash,
        createdById: req.user.id,
        tx,
      });

      await auditService.audit({
        action: "PROJECT_CREATED",
        userId: user.id,
        metadata: { projectId: project.id },
        tx,
      });

      return project;
    });
    return NextResponse.json({
      data: { project: result, apiKey: raw },
    });
  } catch (err) {
    console.error("Create projects failed", err);
    return NextResponse.json(
      { error: "Unable to create project" },
      { status: 500 },
    );
  }
});

export const GET = requireAuth(async (req) => {
  const projectService = new ProjectService();
  const { page, limit, skip } = parsePagination(req);

  const where = {
    ownerId: req.user.id,
    deletedAt: null,
  };

  const [projects, total] = await prisma.$transaction(async (tx) => {
    const projects = await projectService.findProjects({
      where,
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
      tx,
    });

    const total = await projectService.countProjects({ where, tx });

    return [projects, total];
  });

  return NextResponse.json(
    {
      data: projects,
      meta: {
        total,
        page,
        perPage: limit,
        totalPages: Math.ceil(total / limit),
      },
    },
    { status: 200 },
  );
});
