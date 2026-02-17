import { requireAuth } from "@/api/middleware/requireAuth";
import ApiKeyService from "@/api/services/ApiKeyService";
import { NextResponse } from "next/server";

export const POST = requireAuth(async (req, ctx) => {
  const apiKeyService = new ApiKeyService();
  const { params } = req;
  const apiKeyId = params[":id"];

  await apiKeyService.updateApiKey({
    where: { id: apiKeyId },
    data: { revokedAt: new Date() },
  });

  return NextResponse.json({ success: true }, { status: 200 });
});
