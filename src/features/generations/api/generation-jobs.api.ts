import {
  createGenerationJobResponseSchema,
  generationJobListResponseSchema,
} from "@/features/generations/schemas/generation-job-dto.schema"
import type {
  CreateGenerationJobBody,
  GenerationJobDto,
} from "@/features/generations/types/generation-job.types"
import { apiRequest } from "@/lib/http-client"

export async function listGenerationJobsApi(): Promise<GenerationJobDto[]> {
  const raw = await apiRequest<unknown>("/api/generation-jobs")
  const parsed = generationJobListResponseSchema.safeParse(raw)
  if (!parsed.success) {
    throw new Error("Unexpected generation jobs list shape")
  }
  return parsed.data.jobs
}

export async function createGenerationJobApi(
  body: CreateGenerationJobBody
): Promise<{ jobId: string }> {
  const raw = await apiRequest<unknown>("/api/generation-jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const parsed = createGenerationJobResponseSchema.safeParse(raw)
  if (!parsed.success) {
    throw new Error("Unexpected create job response shape")
  }
  return { jobId: parsed.data.jobId }
}
