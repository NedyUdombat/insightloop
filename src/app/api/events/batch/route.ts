import { requireApiKey } from "@/api/middleware/requireApiKey";
import { NextRequest, NextResponse } from "next/server";
import { BatchEventSchema } from "@/api/validators/event";
import EventService from "@/api/services/EventService";
import { headers } from "next/headers";
import { prisma } from "@/api/lib/db";
import { resolveEventTimestamp } from "@/api/lib/eventTimestamp";
import EndUserService from "@/api/services/EndUserService";
import RateLimitService from "@/api/services/RateLimitService";

const MAX_PAYLOAD_BYTES = 32 * 1024; // 32KB - tweak

export async function POST(req: NextRequest) {
  const auth = await requireApiKey(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const eventService = new EventService();
  const endUserService = new EndUserService();
  const rateLimitService = new RateLimitService();

  const [apiKeyLimit, projectLimit] = await Promise.all([
    rateLimitService.hit({
      key: "EVENT_INGEST",
      identifier: auth.apiKeyId,
      maxRequests: 1000,
      windowMs: 60 * 1000, // 1 minute
    }),
    rateLimitService.hit({
      key: "EVENT_INGEST_PROJECT",
      identifier: auth.projectId,
      maxRequests: 50_000,
      windowMs: 60 * 1000,
    }),
  ]);

  if (!apiKeyLimit.allowed || !projectLimit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const headerStore = await headers();
  const contentLength = headerStore.get("content-length");
  if (contentLength && Number(contentLength) > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  const reqBody = await req.json();

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
      // Process each event in the batch
      for (const event of events) {
        // Determine externalUserId: userId takes precedence over anonymousId
        const externalUserId = event.userId || event.anonymousId || null;

        // Resolve or create EndUser
        const resolvedEndUser = await endUserService.resolveEndUser({
          projectId: auth.projectId,
          externalUserId,
          tx,
        });

        // Parse and validate timestamp
        const timestamp = resolveEventTimestamp(event.eventTimestamp);

        // Create event
        await eventService.createEvent({
          eventName: event.eventName,
          eventTimeStamp: timestamp,
          properties: event.properties || {},
          projectId: auth.projectId,
          endUserId: resolvedEndUser?.id,
          tx,
        });
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
