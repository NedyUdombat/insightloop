import { NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";
import { CreateApiKeySchema } from "@/api/validators/project";
import { prisma } from "@/api/lib/db";
import ProjectService from "@/api/services/ProjectService";
import ApiKeyService from "@/api/services/ApiKeyService";

export const POST = requireAuth(async (req, ctx) => {
  const projectService = new ProjectService();
  const apiKeyService = new ApiKeyService();

  const { params } = req;
  const projectId = params[":projectId"];

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

  const { name } = validatedData.data;

  const { raw, hash } = await apiKeyService.generateApiKey();

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
    });
  });
  return NextResponse.json(
    { data: { apiKey: raw }, success: true },
    { status: 200 },
  );
});

export const GET = requireAuth(async (req, ctx) => {
  const apiKeyService = new ApiKeyService();

  const { params } = req;
  const projectId = params[":projectId"];

  const apiKeys = await apiKeyService.fetchApiKeys({
    where: {
      projectId,
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    { data: { apiKeys }, success: true },
    { status: 200 },
  );
});
