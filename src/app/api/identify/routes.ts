import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "@/api/middleware/requireApiKey";
import RateLimitService from "@/api/services/RateLimitService";
import { IdentifySchema } from "@/api/validators/identify";
import EndUserService from "@/api/services/EndUserService";
import { prisma } from "@/api/lib/db";

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
      identifier: auth.apiKeyId,
      maxRequests: 1000,
      windowMs: 60 * 1000, // 1 minute
    }),
    rateLimitService.hit({
      key: "IDENTIFY_PROJECT",
      identifier: auth.projectId,
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

  const { userId, anonymousId, traits } = validatedData.data;

  const endUserService = new EndUserService();

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Link anonymous user to identified user
      return await endUserService.linkAnonymousToIdentified({
        projectId: auth.projectId,
        userId,
        anonymousId,
        traits,
        tx,
      });
    });

    // Log identity linking for debugging (not audit log since no dashboard userId)
    if (result.mergedCount > 0) {
      console.log(
        `[Identity] Linked ${result.eventsLinked} events and ${result.feedbacksLinked} feedbacks from ${result.mergedCount} anonymous user(s) to identified user ${userId}`,
      );
    }

    return NextResponse.json(
      {
        success: true,
        endUserId: result.identifiedUser.id,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Identity linking failed", err);
    return NextResponse.json(
      { error: "Identity linking failed" },
      { status: 500 },
    );
  }
}
