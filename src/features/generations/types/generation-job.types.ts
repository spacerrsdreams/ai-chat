import type { z } from "zod"

import type { createGenerationJobBodySchema } from "@/features/generations/schemas/create-generation-job-body.schema"
import type { generationJobDtoSchema } from "@/features/generations/schemas/generation-job-dto.schema"

export type GenerationJobDto = z.infer<typeof generationJobDtoSchema>

export type CreateGenerationJobBody = z.infer<
  typeof createGenerationJobBodySchema
>
