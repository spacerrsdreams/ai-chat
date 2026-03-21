import { NextResponse } from "next/server"

import { getGenerationJobById } from "@/features/generations/repositories/generation-job.repository"
import { generationJobToDto } from "@/features/generations/utils/generation-job-dto.utils"

export const runtime = "nodejs"

type RouteContext = { params: Promise<{ jobId: string }> }

export async function GET(_req: Request, context: RouteContext) {
  const { jobId } = await context.params
  const row = await getGenerationJobById(jobId)
  if (!row) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }
  return NextResponse.json({ job: generationJobToDto(row) })
}
