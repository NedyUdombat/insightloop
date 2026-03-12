import * as z from "zod";

export const IdentifySchema = z.object({
  userId: z.string().min(1).max(256),
  email: z.email().optional(),
  firstName: z.string().max(256).optional(),
  lastName: z.string().max(256).optional(),
  traits: z.record(z.string(), z.unknown()).optional(), // Allows any key-value pairs
});

export type IdentifyPayload = z.infer<typeof IdentifySchema>;
