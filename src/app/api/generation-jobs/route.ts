import { after } from "next/server"
import { NextResponse } from "next/server"

import { createGenerationJobBodySchema } from "@/features/generations/schemas/create-generation-job-body.schema"
import { generationJobListQuerySchema } from "@/features/generations/schemas/generation-job-list-query.schema"
import {
  createPendingGenerationJob,
  listGenerationJobsPaged,
} from "@/features/generations/repositories/generation-job.repository"
import { runGenerationJob } from "@/features/generations/services/run-generation-job.service"
import { generationJobToDto } from "@/features/generations/utils/generation-job-dto.utils"

export const runtime = "nodejs"

export async function POST(req: Request) {
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = createGenerationJobBodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const { prompt, kind } = parsed.data
  const { id } = await createPendingGenerationJob({ prompt, kind })

  after(async () => {
    await runGenerationJob(id)
  })

  return NextResponse.json({ jobId: id }, { status: 202 })
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const parsed = generationJobListQuerySchema.safeParse({
    limit: url.searchParams.get("limit") ?? undefined,
    offset: url.searchParams.get("offset") ?? undefined,
  })
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const { offset, limit } = parsed.data
  const { rows, hasMore } = await listGenerationJobsPaged({ offset, limit })
  const jobs = rows.map(generationJobToDto)
  return NextResponse.json({ jobs, offset, limit, hasMore })
}
