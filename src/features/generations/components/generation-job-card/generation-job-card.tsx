"use client"

import Image from "next/image"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { GenerationJobPromptExcerpt } from "@/features/generations/components/generation-job-prompt-excerpt/generation-job-prompt-excerpt"
import type { GenerationJobCardProps } from "@/features/generations/types/generation-job-card.types"

const statusLabel = {
  PENDING: "Pending",
  GENERATING: "Generating",
  COMPLETED: "Completed",
  FAILED: "Failed",
} as const

export const GenerationJobCard = ({ job }: GenerationJobCardProps) => {
  const status = statusLabel[job.status]

  return (
    <Card className="flex h-[280px] w-[280px] shrink-0 flex-col overflow-hidden py-0">
      <CardHeader className="shrink-0 space-y-1.5 border-b px-2 py-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium capitalize text-foreground">
            {job.kind}
          </span>
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            {status}
          </span>
        </div>
        <GenerationJobPromptExcerpt prompt={job.prompt} />
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col p-0">
        {job.status === "FAILED" ? (
          <div className="flex flex-1 items-center justify-center p-3 text-center text-sm text-destructive">
            {job.errorMessage?.trim() || "Generation failed"}
          </div>
        ) : null}

        {(job.status === "PENDING" || job.status === "GENERATING") && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-3 text-sm text-muted-foreground">
            <Spinner className="size-8" />
            <span>
              {job.status === "PENDING"
                ? "Waiting to start…"
                : "Generating…"}
            </span>
          </div>
        )}

        {job.status === "COMPLETED" && job.kind === "image" && job.resultUrl ? (
          <div className="relative min-h-0 w-full flex-1 bg-muted/30">
            <Image
              alt="Generated result"
              className="object-contain"
              fill
              sizes="280px"
              src={job.resultUrl}
              unoptimized
            />
          </div>
        ) : null}

        {job.status === "COMPLETED" && job.kind === "text" && job.resultText ? (
          <div className="min-h-0 flex-1 overflow-auto p-3 text-left text-sm leading-relaxed">
            {job.resultText}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
