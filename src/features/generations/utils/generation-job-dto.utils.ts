import type { GenerationJob } from "@/generated/prisma/client"

import type { GenerationJobDto } from "@/features/generations/types/generation-job.types"

export function generationJobToDto(job: GenerationJob): GenerationJobDto {
  return {
    id: job.id,
    status: job.status,
    kind: job.kind,
    prompt: job.prompt,
    resultUrl: job.resultUrl,
    resultText: job.resultText,
    errorMessage: job.errorMessage,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  }
}
