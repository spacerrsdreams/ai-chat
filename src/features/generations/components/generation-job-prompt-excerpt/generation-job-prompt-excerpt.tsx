"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import type { GenerationJobPromptExcerptProps } from "@/features/generations/types/generation-job-prompt-excerpt.types"

const DEFAULT_MAX = 300

export const GenerationJobPromptExcerpt = ({
  prompt,
  maxLength = DEFAULT_MAX,
}: GenerationJobPromptExcerptProps) => {
  const [expanded, setExpanded] = useState(false)
  const needsMore = prompt.length > maxLength
  const visible =
    expanded || !needsMore ? prompt : prompt.slice(0, maxLength)

  return (
    <p className="text-left text-xs leading-snug text-muted-foreground">
      <span className="break-words">{visible}</span>
      {needsMore && !expanded ? <span>…</span> : null}
      {needsMore ? (
        <Button
          className="ml-1 inline h-auto min-h-0 p-0 align-baseline text-xs font-medium"
          onClick={() => {
            setExpanded((v) => !v)
          }}
          type="button"
          variant="link"
        >
          {expanded ? "See less" : "See more"}
        </Button>
      ) : null}
    </p>
  )
}
