import { after } from "next/server"
import { NextResponse } from "next/server"

import { createGenerationJobBodySchema } from "@/features/generations/schemas/create-generation-job-body.schema"
import {
  createPendingGenerationJob,
  listGenerationJobsNewestFirst,
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

export async function GET() {
  const rows = await listGenerationJobsNewestFirst()
  const jobs = rows.map(generationJobToDto)
  return NextResponse.json({ jobs })
}
