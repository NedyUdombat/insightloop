import * as z from "zod";

export const EndUserSchema = z.object({
  id: z.string().optional(), // external user id
  email: z.email().optional(),
  name: z.string().max(256).optional(),
});

export const EventSchema = z.strictObject({
  id: z.string().optional(), // SDK-generated event ID for deduplication
  eventName: z.string().trim().max(100).min(3),
  eventTimestamp: z.date().optional(), // ISO string from SDK
  userId: z.string().optional().nullable(), // SDK field name
  properties: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()]),
    )
    .optional(),
  metadata: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()]),
    )
    .optional(),
});

// Batch event schema to support SDK batching
export const BatchEventSchema = z.object({
  environment: z.string().optional(),
  events: z.array(EventSchema),
});

export type BatchEventPayload = z.infer<typeof BatchEventSchema>;
