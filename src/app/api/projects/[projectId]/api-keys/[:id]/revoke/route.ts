import { requireAuth } from "@/api/middleware/requireAuth";
import ApiKeyService from "@/api/services/ApiKeyService";
import { NextResponse } from "next/server";

export const DELETE = requireAuth(async (req) => {
  const apiKeyService = new ApiKeyService();
  const apiKeyId = req.params?.id;

  if (!apiKeyId) {
    return NextResponse.json({ error: "Invalid api key id" }, { status: 400 });
  }

  await apiKeyService.assertOwnership({
    apiKeyId,
    ownerId: req.user.id,
  });

  await apiKeyService.revokeApiKey({
    apiKeyId,
    ownerId: req.user.id,
  });

  return NextResponse.json({ success: true }, { status: 200 });
});
