import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/api/lib/db";
import { requireApiKey } from "@/api/middleware/requireApiKey";
import EndUserService from "@/api/services/EndUserService";
import RateLimitService from "@/api/services/RateLimitService";
import { IdentifySchema } from "@/api/validators/identify";

const MAX_PAYLOAD_BYTES = 16 * 1024; // 16KB - identify should be small

export async function POST(req: NextRequest) {
  const auth = await requireApiKey(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimitService = new RateLimitService();

  const [apiKeyLimit, projectLimit] = await Promise.all([
    rateLimitService.hit({
      key: "IDENTIFY",
      identifier: auth.apiKey.id,
      maxRequests: 1000,
      windowMs: 60 * 1000, // 1 minute
    }),
    rateLimitService.hit({
      key: "IDENTIFY_PROJECT",
      identifier: auth.project.id,
      maxRequests: 50_000,
      windowMs: 60 * 1000,
    }),
  ]);

  if (!apiKeyLimit.allowed || !projectLimit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const contentLength = req.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  const reqBody = await req.json();
  const validatedData = IdentifySchema.safeParse(reqBody);
  if (!validatedData.success) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 },
    );
  }

  const { userId, email, firstName, lastName, traits } = validatedData.data;

  const endUserService = new EndUserService();

  try {
    const endUser = await prisma.$transaction(async (tx) => {
      return await endUserService.identify({
        projectId: auth.project.id,
        userId,
        email,
        firstName,
        lastName,
        traits,
        tx,
      });
    });

    return NextResponse.json(
      {
        success: true,
        endUserId: endUser.id,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Identify failed", err);
    return NextResponse.json({ error: "Identify failed" }, { status: 500 });
  }
}
