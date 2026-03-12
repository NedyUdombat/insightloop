import * as z from "zod";
import { EndUserSchema } from "@/api/validators/event";
import { Environment } from "@/generated/prisma/enums";

export const FeedbackSchema = z.object({
  message: z.string().min(1).max(3000),
  endUser: EndUserSchema.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const JSONValue: z.ZodType<any> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(JSONValue),
    z.record(z.string(), JSONValue),
  ]),
);

// SDK-compatible feedback schema (matches what browser SDK sends)
export const SDKFeedbackSchema = z.object({
  title: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  message: z.string().min(1).max(3000),
  environment: z.enum(Environment),
  additionalInfo: z.string().optional(),
  userId: z.string().optional().nullable(), // SDK field name
  properties: z.record(z.string(), JSONValue).optional(),
  metadata: z.record(z.string(), JSONValue).optional(),
  feedbackTimestamp: z.string(),
});

export type SDKFeedbackPayload = z.infer<typeof SDKFeedbackSchema>;
