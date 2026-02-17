import * as z from "zod";

export const CreateProjectSchema = z.strictObject({
  name: z.string().trim().max(100).min(3),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export const CreateApiKeySchema = z.strictObject({
  name: z.string().trim().max(100).min(3),
});
