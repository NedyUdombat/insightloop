import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/api/lib/db";
import { requireApiKey } from "@/api/middleware/requireApiKey";
import EndUserService from "@/api/services/EndUserService";
import FeedbackService from "@/api/services/FeedbackService";
import notificationService from "@/api/services/NotificationService";
import RateLimitService from "@/api/services/RateLimitService";
import { SDKFeedbackSchema } from "@/api/validators/feedback";

const MAX_PAYLOAD_BYTES = 24 * 1024; // feedback should be smaller

export async function POST(req: NextRequest) {
  const auth = await requireApiKey(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const feedbackService = new FeedbackService();
  const endUserService = new EndUserService();
  const rateLimitService = new RateLimitService();

  // Environment-specific rate limits
  const isDevelopment = auth.apiKey.environment === "DEVELOPMENT";
  const isStaging = auth.apiKey.environment === "STAGING";

  // Development: Lower limits for testing
  // Staging: Medium limits for pre-production testing
  // Production: Higher limits for live traffic
  const apiKeyMaxRequests = isDevelopment ? 1000 : isStaging ? 5000 : 10000;
  const projectMaxRequests = isDevelopment
    ? 5_000
    : isStaging
      ? 25_000
      : 50_000;

  const [apiKeyLimit, projectLimit, environmentLimit] = await Promise.all([
    rateLimitService.hit({
      key: "FEEDBACK_INGEST",
      identifier: auth.apiKey.id,
      maxRequests: apiKeyMaxRequests,
      windowMs: 60 * 1000, // 1 minute
    }),
    rateLimitService.hit({
      key: "FEEDBACK_INGEST_PROJECT",
      identifier: auth.project.id,
      maxRequests: projectMaxRequests,
      windowMs: 60 * 1000,
    }),
    // Per-environment rate limit
    rateLimitService.hit({
      key: `FEEDBACK_INGEST_ENV_${auth.apiKey.environment}`,
      identifier: `${auth.project.id}_${auth.apiKey.environment}`,
      maxRequests: projectMaxRequests,
      windowMs: 60 * 1000,
    }),
  ]);

  if (
    !apiKeyLimit.allowed ||
    !projectLimit.allowed ||
    !environmentLimit.allowed
  ) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const headerStore = await headers();
  const contentLength = headerStore.get("content-length");
  if (contentLength && Number(contentLength) > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  const reqBody = await req.json();

  // Validate using SDK schema (matches browser SDK payload format)
  const validatedData = SDKFeedbackSchema.safeParse(reqBody);
  if (!validatedData.success) {
    console.error("Invalid request data:", validatedData);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 },
    );
  }

  const feedback = validatedData.data;

  // Extract user identifier
  const externalUserId = feedback.userId || null;

  try {
    await prisma.$transaction(async (tx) => {
      // Step 1: Find or create EndUser
      const endUser = await endUserService.findOrCreateEndUser({
        projectId: auth.project.id,
        externalUserId,
        tx,
      });

      // Step 2: Create feedback using the EndUser's id
      const createdFeedback = await feedbackService.createFeedback({
        projectId: auth.project.id,
        endUserId: endUser.id,
        message: feedback.message,
        environment: auth.apiKey.environment,
        metadata: feedback.metadata || {},
        feedbackTimestamp: feedback.feedbackTimestamp
          ? new Date(feedback.feedbackTimestamp)
          : new Date(),
        rating: feedback.rating,
        properties: feedback.properties || {},
        tx,
      });

      // Create notification after transaction completes (if enabled)
      if (auth.project.feedbackNotifications && createdFeedback.id) {
        // Fire and forget - don't block the response
        notificationService
          .createFeedbackNotification(
            auth.project.ownerId,
            auth.project.id,
            feedback.message || "New feedback received",
            createdFeedback.id,
            feedback.rating || undefined,
          )
          .catch((err) =>
            console.error("Failed to create feedback notification:", err),
          );
      }
    });
    return NextResponse.json({ success: true }, { status: 202 });
  } catch (err) {
    console.error("Feedback ingestion failed", err);
    return NextResponse.json({ error: "Ingestion failed" }, { status: 500 });
  }
}
