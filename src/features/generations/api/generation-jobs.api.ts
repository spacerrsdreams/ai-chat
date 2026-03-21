import { GENERATION_JOBS_PAGE_SIZE } from "@/features/generations/constants/generation-jobs-page-size"
import {
  createGenerationJobResponseSchema,
  generationJobListResponseSchema,
} from "@/features/generations/schemas/generation-job-dto.schema"
import type {
  CreateGenerationJobBody,
  GenerationJobListPage,
} from "@/features/generations/types/generation-job.types"
import { apiRequest } from "@/lib/http-client"

function buildListUrl(offset: number, limit: number): string {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
  })
  return `/api/generation-jobs?${params.toString()}`
}

export async function listGenerationJobsPageApi(input?: {
  offset?: number
  limit?: number
}): Promise<GenerationJobListPage> {
  const offset = input?.offset ?? 0
  const limit = input?.limit ?? GENERATION_JOBS_PAGE_SIZE
  const raw = await apiRequest<unknown>(buildListUrl(offset, limit))
  const parsed = generationJobListResponseSchema.safeParse(raw)
  if (!parsed.success) {
    throw new Error("Unexpected generation jobs list shape")
  }
  return parsed.data
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
