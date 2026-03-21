import { z } from "zod"

export const generationJobStatusSchema = z.enum([
  "PENDING",
  "GENERATING",
  "COMPLETED",
  "FAILED",
])

export const generationJobKindSchema = z.enum(["image", "text"])

export const generationJobDtoSchema = z.object({
  id: z.string(),
  status: generationJobStatusSchema,
  kind: generationJobKindSchema,
  prompt: z.string(),
  resultUrl: z.string().nullable(),
  resultText: z.string().nullable(),
  errorMessage: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const generationJobListResponseSchema = z.object({
  jobs: z.array(generationJobDtoSchema),
  limit: z.number(),
  offset: z.number(),
  hasMore: z.boolean(),
})

export const createGenerationJobResponseSchema = z.object({
  jobId: z.string(),
})

export const generationJobDetailResponseSchema = z.object({
  job: generationJobDtoSchema,
})
