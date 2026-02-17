import * as z from "zod";

export const IdentifySchema = z.object({
  dataset: z.string().optional(),
  userId: z.string().min(1).max(256),
  anonymousId: z.string().min(1).max(256),
  traits: z
    .object({
      email: z.string().email().optional(),
      name: z.string().max(256).optional(),
    })
    .passthrough() // Allow additional custom traits
    .optional(),
});

export type IdentifyPayload = z.infer<typeof IdentifySchema>;
