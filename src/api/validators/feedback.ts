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
    rating: z.number().int().min(1).max(5).optional(), // Rating from 1-5
    title: z.string().optional(), // Optional title for the feedback
    message: z.string().min(1).max(3000), // SDK uses "text" which maps to "message"
    additionalInfo: z.string().optional(), // Any additional information
    properties: z.record(z.string(), z.unknown()).optional(), // Developer-provided custom properties
    metadata: z.record(z.string(), z.unknown()).optional(), // System-generated metadata (location, device, IP, host, URL, etc.)
    environment: z.enum(["DEVELOPMENT", "STAGING", "PRODUCTION"]), // Required environment field
    feedbackTimestamp: z.string().datetime().optional(),
    userId: z.string().optional().nullable(),
    anonymousId: z.string().optional(),
  }),
});

export type SDKFeedbackPayload = z.infer<typeof SDKFeedbackSchema>;
