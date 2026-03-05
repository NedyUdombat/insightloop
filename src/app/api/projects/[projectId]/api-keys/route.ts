import { prisma } from "@/api/lib/db";
import { requireAuth } from "@/api/middleware/requireAuth";
import ApiKeyService from "@/api/services/ApiKeyService";
import AuditService from "@/api/services/AuditService";
import ProjectService from "@/api/services/ProjectService";
import { CreateApiKeySchema } from "@/api/validators/project";
import { NextResponse } from "next/server";

export const POST = requireAuth(async (req) => {
  const projectService = new ProjectService();
  const apiKeyService = new ApiKeyService();
  const auditService = new AuditService();

  const projectId = req.params?.projectId;

  if (!projectId) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  const reqBody = await req.json();

  const validatedData = CreateApiKeySchema.safeParse(reqBody);
  if (!validatedData.success) {
    return NextResponse.json(
      {
        error: "Invalid request data",
      },
      { status: 400 },
    );
  }

  const { name, type, environment } = validatedData.data;

  const { raw, hash, keyHint } = await apiKeyService.generateApiKey({
    type,
    environment,
  });

  await prisma.$transaction(async (tx) => {
    await projectService.assertOwnership({
      projectId,
      userId: req.user.id,
      tx,
    });

    await apiKeyService.createApiKey({
      name,
      projectId,
      keyHash: hash,
      createdById: req.user.id,
      tx,
      keyHint,
      type,
      environment,
      keyValue: raw, // Optional: Store raw key value if needed (not recommended for security reasons)
    });

    // Audit log for API key creation
    await auditService.audit({
      action: "API_KEY_CREATED",
      userId: req.user.id,
      metadata: {
        projectId,
        apiKeyName: name,
        apiKeyType: type,
        environment,
        keyHint,
      },
      tx,
    });

    // Special audit log for production API key generation
    if (environment === "PRODUCTION") {
      await auditService.audit({
        action: "PRODUCTION_API_KEY_GENERATED",
        userId: req.user.id,
        metadata: {
          projectId,
          apiKeyName: name,
          apiKeyType: type,
          keyHint,
          warning: "Production API key generated - ensure secure storage and usage",
        },
        tx,
      });
    }
  });
  return NextResponse.json(
    {
      data: {
        apiKey: {
          value: raw,
          type,
          environment,
          name,
        },
        hint: keyHint,
      },
      success: true,
    },
    { status: 200 },
  );
});

export const GET = requireAuth(async (req) => {
  const apiKeyService = new ApiKeyService();

  const projectId = req.params?.projectId;

  if (!projectId) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  const apiKeys = await apiKeyService.fetchApiKeys({
    where: {
      projectId,
      deletedAt: null,
      revokedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    { data: { apiKeys }, success: true },
    { status: 200 },
  );
});
