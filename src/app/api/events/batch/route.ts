import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/api/lib/db";
import { resolveEventTimestamp } from "@/api/lib/eventTimestamp";
import { requireApiKey } from "@/api/middleware/requireApiKey";
import EndUserService from "@/api/services/EndUserService";
import EventService from "@/api/services/EventService";
import notificationService from "@/api/services/NotificationService";
import RateLimitService from "@/api/services/RateLimitService";
import { BatchEventSchema } from "@/api/validators/event";
import { NotificationStatus, NotificationType } from "@/generated/prisma/enums";

const MAX_PAYLOAD_BYTES = 32 * 1024; // 32KB - tweak

export async function POST(req: NextRequest) {
  const auth = await requireApiKey(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log({ auth });

  const eventService = new EventService();
  const endUserService = new EndUserService();
  const rateLimitService = new RateLimitService();

  // Environment-specific rate limits
  const isDevelopment = auth.apiKey.environment === "DEVELOPMENT";
  const isStaging = auth.apiKey.environment === "STAGING";

  // Development: Lower limits for testing
  // Staging: Medium limits for pre-production testing
  // Production: Higher limits for live traffic
  const apiKeyMaxRequests = isDevelopment ? 100 : isStaging ? 500 : 1000;
  const projectMaxRequests = isDevelopment
    ? 5_000
    : isStaging
      ? 25_000
      : 50_000;

  const [apiKeyLimit, projectLimit, environmentLimit] = await Promise.all([
    rateLimitService.hit({
      key: "EVENT_INGEST",
      identifier: auth.apiKey.id,
      maxRequests: apiKeyMaxRequests,
      windowMs: 60 * 1000, // 1 minute
    }),
    rateLimitService.hit({
      key: "EVENT_INGEST_PROJECT",
      identifier: auth.project.id,
      maxRequests: projectMaxRequests,
      windowMs: 60 * 1000,
    }),
    // Per-environment rate limit
    rateLimitService.hit({
      key: `EVENT_INGEST_ENV_${auth.apiKey.environment}`,
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

  console.log({
    reqBody: JSON.stringify(reqBody),
  });

  // Validate as batch payload (SDK format)
  const validatedData = BatchEventSchema.safeParse(reqBody);
  if (!validatedData.success) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 },
    );
  }

  const { events } = validatedData.data;

  // Reject empty batches
  if (events.length === 0) {
    return NextResponse.json(
      { error: "Empty batch not allowed" },
      { status: 400 },
    );
  }

  try {
    await prisma.$transaction(async (tx) => {
      const createdEventIds: { eventName: string; eventId: string }[] = [];
      // Process each event in the batch
      for (const event of events) {
        // Determine externalUserId: userId takes precedence over anonymousId
        const externalUserId = event.userId || null;

        // Resolve or create EndUser
        const resolvedEndUser = await endUserService.resolveEndUser({
          projectId: auth.project.id,
          externalUserId,
          tx,
        });

        // Parse and validate timestamp
        const timestamp = resolveEventTimestamp(event.eventTimestamp);

        // Create event
        const createdEvent = await eventService.createEvent({
          eventName: event.eventName,
          eventTimeStamp: timestamp,
          properties: event.properties || {},
          projectId: auth.project.id,
          endUserId: resolvedEndUser?.id,
          environment: auth.apiKey.environment,
          metadata: event.metadata || {},
          tx,
        });

        // Store event info for notifications
        createdEventIds.push({
          eventName: event.eventName,
          eventId: createdEvent.id,
        });

        // Create notifications after transaction completes (if enabled)
        if (auth.project.eventNotifications) {
          // Use createBulk for performance with multiple notifications
          const notificationInputs = createdEventIds.map((evt) => ({
            userId: auth.project.ownerId,
            projectId: auth.project.id,
            title: "New Event Tracked",
            message: `Event "${evt.eventName}" was tracked in your project`,
            type: NotificationType.EVENT,
            status: NotificationStatus.INFO,
            actionUrl: `/dashboard/${auth.project.id}/events/${evt.eventId}`,
            data: { eventName: evt.eventName, eventId: evt.eventId },
          }));

          // Fire and forget - don't block the response
          notificationService
            .createBulk(notificationInputs)
            .catch((err) =>
              console.error("Failed to create event notifications:", err),
            );
        }
      }
    });

    return NextResponse.json(
      { success: true, eventsProcessed: events.length },
      { status: 202 },
    );
  } catch (err) {
    console.error("Ingest event batch failed", err);
    return NextResponse.json({ error: "Ingestion failed" }, { status: 500 });
  }
}
