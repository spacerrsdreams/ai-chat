import "server-only"

import type { GenerationJob, GenerationJobKind } from "@/generated/prisma/client"

import { prisma } from "@/lib/prisma"

export async function createPendingGenerationJob(input: {
  kind: GenerationJobKind
  prompt: string
}): Promise<{ id: string }> {
  const row = await prisma.generationJob.create({
    data: {
      kind: input.kind,
      prompt: input.prompt,
    },
    select: { id: true },
  })
  return { id: row.id }
}

export async function markGenerationJobGenerating(id: string): Promise<void> {
  await prisma.generationJob.update({
    where: { id },
    data: { status: "GENERATING" },
  })
}

export async function completeGenerationJobImage(input: {
  id: string
  resultUrl: string
}): Promise<void> {
  await prisma.generationJob.update({
    where: { id: input.id },
    data: {
      status: "COMPLETED",
      resultUrl: input.resultUrl,
      resultText: null,
      errorMessage: null,
    },
  })
}

export async function completeGenerationJobText(input: {
  id: string
  resultText: string
}): Promise<void> {
  await prisma.generationJob.update({
    where: { id: input.id },
    data: {
      status: "COMPLETED",
      resultUrl: null,
      resultText: input.resultText,
      errorMessage: null,
    },
  })
}

export async function failGenerationJob(input: {
  id: string
  errorMessage: string
}): Promise<void> {
  await prisma.generationJob.update({
    where: { id: input.id },
    data: {
      status: "FAILED",
      errorMessage: input.errorMessage,
      resultUrl: null,
      resultText: null,
    },
  })
}

export async function getGenerationJobById(id: string) {
  return prisma.generationJob.findUnique({ where: { id } })
}

export async function listGenerationJobsPaged(input: {
  offset: number
  limit: number
}): Promise<{ rows: GenerationJob[]; hasMore: boolean }> {
  const take = input.limit + 1
  const rows = await prisma.generationJob.findMany({
    orderBy: { createdAt: "desc" },
    skip: input.offset,
    take,
  })
  const hasMore = rows.length > input.limit
  const slice = hasMore ? rows.slice(0, input.limit) : rows
  return { rows: slice, hasMore }
}
