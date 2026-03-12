import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { detectProductionKeyMisuse } from "@/api/middleware/validateEnvironment";
import ApiKeyService from "@/api/services/ApiKeyService";

export async function requireApiKey(_req: NextRequest) {
  const headerStore = await headers();
  const apiKeyService = new ApiKeyService();
  const authHeader = headerStore.get("authorization");
  if (!authHeader?.startsWith("Bearer")) return null;

  const rawKey = authHeader?.replace("Bearer ", "").trim();
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

  // Detect potential misuse of production API keys
  const host = headerStore.get("host") || undefined;
  const misuse = detectProductionKeyMisuse(apiKey.environment, {
    nodeEnv: process.env.NODE_ENV,
    host,
  });

  if (misuse.isMisuse) {
    console.warn(`⚠️ API Key Misuse Detected: ${misuse.warning}`, {
      apiKeyId: apiKey.id,
      projectId: apiKey.project?.id,
      environment: apiKey.environment,
      host,
    });

    // You could also log this to an audit log or send an alert
    // For now, we're just warning - not blocking the request
  }

  await apiKeyService.updateApiKey({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });

  return {
    apiKey: apiKey,
    project: apiKey.project,
    environmentWarning: misuse.isMisuse ? misuse.warning : undefined,
  };
}
