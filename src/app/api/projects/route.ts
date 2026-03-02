import { getClientIp } from "@/api/lib/client";
import { prisma } from "@/api/lib/db";
import { parsePagination } from "@/api/lib/pagination";
import { requireAuth } from "@/api/middleware/requireAuth";
import ApiKeyService from "@/api/services/ApiKeyService";
import AuditService from "@/api/services/AuditService";
import ProjectService from "@/api/services/ProjectService";
import RateLimitService from "@/api/services/RateLimitService";
import { CreateProjectSchema } from "@/api/validators/project";
import { ApiKeyType, Environment } from "@/generated/prisma/enums";
import { NextResponse } from "next/server";

const DEFAULT_API_KEY_NAME = "Default";

export const POST = requireAuth(async (req) => {
  const auditService = new AuditService();
  const apiKeyService = new ApiKeyService();
  const projectService = new ProjectService();
  const rateLimitService = new RateLimitService();
  const user = req.user;

  if (!user.emailVerified) {
    return NextResponse.json(
      {
        error:
          "Email not verified. Please verify your email to create projects.",
      },
      { status: 403 },
    );
  }

  const reqBody = await req.json();
  const validatedData = CreateProjectSchema.safeParse(reqBody);
  if (!validatedData.success) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 },
    );
  }

  const { name } = validatedData.data;

  await projectService.canCreateProject({
    userId: user.id,
  });

  const ip = await getClientIp();

  const [ipLimit, userLimit] = await Promise.all([
    rateLimitService.hit({
      key: "PROJECT_CREATE",
      maxRequests: 10, // per IP
      windowMs: 60 * 60 * 1000, // 1 hour
      identifier: ip,
    }),

    rateLimitService.hit({
      key: "PROJECT_CREATE",
      maxRequests: 3, // per user
      windowMs: 60 * 60 * 1000, // 1 hour
      identifier: user.id,
    }),
  ]);

  if (!ipLimit.allowed || !userLimit.allowed) {
    return NextResponse.json(
      {
        error: true,
        message: "Too many project creation attempts. Try again later.",
      },
      { status: 429 },
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const keyType = ApiKeyType.INGESTION;
      const keyEnv = Environment.DEVELOPMENT;
      const { raw, hash, keyHint } = await apiKeyService.generateApiKey({
        type: keyType,
        environment: keyEnv,
      });
      const project = await projectService.createProject({
        name,
        ownerId: req.user.id,
        tx,
      });

      await apiKeyService.createApiKey({
        name: DEFAULT_API_KEY_NAME,
        projectId: project.id,
        keyHash: hash,
        keyHint,
        createdById: req.user.id,
        type: keyType,
        environment: keyEnv,
        tx,
        keyValue: raw, // Optional: Store raw key value if needed (not recommended for security reasons)
      });

      await auditService.audit({
        action: "PROJECT_CREATED",
        userId: user.id,
        metadata: { projectId: project.id },
        tx,
      });

      return { project, raw };
    });

    const publicProject = await projectService.serializeProject(result.project);

    return NextResponse.json({
      success: true,
      data: {
        project: publicProject,
        apiKey: {
          value: result.raw,
          environment: Environment.DEVELOPMENT,
          type: ApiKeyType.INGESTION,
          name: DEFAULT_API_KEY_NAME,
        },
      },
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: "Project name already exists." },
        { status: 409 },
      );
    }

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
      select: {
        id: true,
        name: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
      },
      tx,
    });

    const total = await projectService.countProjects({ where, tx });

    return [projects, total];
  });

  return NextResponse.json(
    {
      success: true,
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
