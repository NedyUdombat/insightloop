import { NextRequest, NextResponse } from "next/server";
import { requireApiKey } from "@/api/middleware/requireApiKey";
import RateLimitService from "@/api/services/RateLimitService";
import { SDKFeedbackSchema } from "@/api/validators/feedback";
import EndUserService from "@/api/services/EndUserService";
import FeedbackService from "@/api/services/FeedbackService";
import { prisma } from "@/api/lib/db";

const MAX_PAYLOAD_BYTES = 24 * 1024; // feedback should be smaller

export async function POST(req: NextRequest) {
  const auth = await requireApiKey(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rateLimitService = new RateLimitService();

  const [apiKeyLimit, projectLimit] = await Promise.all([
    rateLimitService.hit({
      key: "FEEDBACK_INGEST",
      identifier: auth.apiKeyId,
      maxRequests: 1000,
      windowMs: 60 * 1000, // 1 minute
    }),
    rateLimitService.hit({
      key: "FEEDBACK_INGEST_PROJECT",
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

  // Validate using SDK schema (matches browser SDK payload format)
  const validatedData = SDKFeedbackSchema.safeParse(reqBody);
  if (!validatedData.success) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 },
    );
  }

  const { feedback } = validatedData.data;

  // Extract user identifier (userId takes precedence over anonymousId)
  const externalUserId = feedback.userId || feedback.anonymousId || null;

  const endUserService = new EndUserService();
  const feedbackService = new FeedbackService();

  try {
    await prisma.$transaction(async (tx) => {
      const resolvedEndUser = await endUserService.resolveEndUser({
        projectId: auth.projectId,
        externalUserId,
        email: null, // Feedback doesn't carry email/name (only identify does)
        name: null,
        tx,
      });

      // Build metadata from SDK fields (rating, properties, timestamp, etc.)
      const metadata = {
        rating: feedback.rating,
        properties: feedback.properties,
        feedbackTimestamp: feedback.feedbackTimestamp,
        sdkFeedbackId: feedback.id, // Store SDK-generated ID for reference
      };

      await feedbackService.createFeedback({
        projectId: auth.projectId,
        endUserId: resolvedEndUser?.id,
        message: feedback.text, // SDK uses "text", backend uses "message"
        metadata,
        tx,
      });
    });
    return NextResponse.json({ success: true }, { status: 202 });
  } catch (err) {
    console.error("Feedback ingestion failed", err);
    return NextResponse.json({ error: "Ingestion failed" }, { status: 500 });
  }
}
