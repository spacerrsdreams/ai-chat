import { z } from "zod"

import { generationJobKindSchema } from "@/features/generations/schemas/generation-job-dto.schema"

export const createGenerationJobBodySchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt is required")
    .max(8000, "Prompt is too long"),
  kind: generationJobKindSchema,
})
