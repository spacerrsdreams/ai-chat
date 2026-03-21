import { z } from "zod"

export const generationJobZodLikeIssueSchema = z.object({
  message: z.string(),
  path: z.array(z.union([z.string(), z.number()])).optional(),
})

export const generationJobPostErrorBodySchema = z.object({
  error: z.string().optional(),
  issues: z.array(generationJobZodLikeIssueSchema).optional(),
})
