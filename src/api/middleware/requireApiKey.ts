import { NextRequest } from "next/server";
import { headers } from "next/headers";
import ApiKeyService from "@/api/services/ApiKeyService";

export async function requireApiKey(req: NextRequest) {
  const headerStore = await headers();
  const apiKeyService = new ApiKeyService();
  const authHeader = headerStore.get("authorization");
  if (!authHeader?.startsWith("Bearer")) return null;

  const rawKey = authHeader?.replace("Bearer", "");
  const keyHash = await apiKeyService.hashApiKey(rawKey);

  const apiKey = await apiKeyService.fetchSingleApiKey({
    where: {
      keyHash,
      revokedAt: null,
      project: { deletedAt: null },
    },
    include: {
      project: true,
    },
  });

  if (!apiKey) return null;

  await apiKeyService.updateApiKey({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });

  return {
    apiKeyId: apiKey.id,
    projectId: apiKey.projectId,
  };
}
