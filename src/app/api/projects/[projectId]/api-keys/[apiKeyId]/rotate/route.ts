import { NextResponse } from "next/server";
import { requireAuth } from "@/api/middleware/requireAuth";
import ApiKeyService from "@/api/services/ApiKeyService";

export const POST = requireAuth(async (req) => {
  const apiKeyService = new ApiKeyService();
  const apiKeyId = req.params?.apiKeyId;

  if (!apiKeyId) {
    return NextResponse.json({ error: "Invalid api key id" }, { status: 400 });
  }

  try {
    const newApiKey = await apiKeyService.rotateApiKey({
      apiKeyId,
      ownerId: req.user.id,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          apiKey: newApiKey,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to rotate API key:", error);
    return NextResponse.json(
      { error: "Failed to rotate API key" },
      { status: 403 },
    );
  }
});
