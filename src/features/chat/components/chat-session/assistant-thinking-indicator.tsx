"use client"

import { Shimmer } from "@/components/ai-elements/shimmer"
import { Sparkles } from "lucide-react"

export const AssistantThinkingIndicator = () => {
  return (
    <div aria-live="polite" className="flex items-center gap-2.5" role="status">
      <span className="inline-flex shrink-0 items-center justify-center rounded-lg bg-foreground p-2">
        <Sparkles aria-hidden className="size-4 text-background" />
      </span>
      <Shimmer as="span" className="text-xs" duration={2.2} spread={2}>
        Thinking...
      </Shimmer>
    </div>
  )
}
