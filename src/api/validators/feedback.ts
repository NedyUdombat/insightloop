import * as z from "zod";
import { EndUserSchema } from "@/api/validators/event";

export const FeedbackSchema = z.object({
  message: z.string().min(1).max(3000),
  endUser: EndUserSchema.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// SDK-compatible feedback schema (matches what browser SDK sends)
export const SDKFeedbackSchema = z.object({
  dataset: z.string().optional(),
  apiKey: z.string().optional(), // SDK sends this in payload for beacon requests
  feedback: z.object({
    id: z.string().optional(), // SDK-generated feedback ID
    text: z.string().min(1).max(3000), // SDK uses "text" not "message"
    rating: z.number().optional(),
    properties: z.record(z.string(), z.unknown()).optional(),
    feedbackTimestamp: z.string().datetime().optional(),
    userId: z.string().optional().nullable(),
    anonymousId: z.string().optional(),
  }),
});

export type SDKFeedbackPayload = z.infer<typeof SDKFeedbackSchema>;
