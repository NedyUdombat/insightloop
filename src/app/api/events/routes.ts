import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/api/lib/db";
import { resolveEventTimestamp } from "@/api/lib/eventTimestamp";
import { requireApiKey } from "@/api/middleware/requireApiKey";
import EndUserService from "@/api/services/EndUserService";
import EventService from "@/api/services/EventService";
import RateLimitService from "@/api/services/RateLimitService";
import { EventSchema } from "@/api/validators/event";

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
      identifier: auth.project.id,
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
  const validatedData = EventSchema.safeParse(reqBody);
  if (!validatedData.success) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 },
    );
  }

  const { eventName, eventTimestamp, properties, anonymousId, userId } =
    validatedData.data;

  try {
    await prisma.$transaction(async (tx) => {
      // Determine externalUserId: userId takes precedence over anonymousId
      const externalUserId = userId || anonymousId || null;

      const resolvedEndUser = await endUserService.resolveEndUser({
        projectId: auth.project.id,
        externalUserId,
        tx,
      });

      // Parse and validate timestamp
      const timestamp = resolveEventTimestamp(eventTimestamp);
      await eventService.createEvent({
        eventName,
        eventTimeStamp: timestamp,
        properties: properties || {},
        projectId: auth.project.id,
        endUserId: resolvedEndUser?.id,
        environment: auth.apiKey.environment,
        tx,
      });
    });

    return NextResponse.json({ success: true }, { status: 202 });
  } catch (err) {
    console.error("Ingest event failed", err);
    // If schema error or conflict, return 400; otherwise 500
    return NextResponse.json({ error: "Ingestion failed" }, { status: 500 });
  }
}
