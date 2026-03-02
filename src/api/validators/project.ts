import * as z from "zod";

export const CreateProjectSchema = z.strictObject({
  name: z.string().trim().max(100).min(3),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export const CreateApiKeySchema = z.strictObject({
  name: z.string().trim().max(100).min(3),
});

export const UpdateProjectSchema = z.object({
  name: z.string().min(3).max(100).optional(),
});

export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
