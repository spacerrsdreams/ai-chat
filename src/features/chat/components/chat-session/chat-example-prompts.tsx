"use client"

import { Button } from "@/components/ui/button"
import { CHAT_EXAMPLE_PROMPTS } from "@/features/chat/constants/chat-example-prompts.constants"
import type { ChatExamplePromptsProps } from "@/features/chat/types/chat-example-prompts.types"

export const ChatExamplePrompts = ({
  disabled = false,
  onSelect,
}: ChatExamplePromptsProps) => {
  return (
    <div
      aria-label="Example prompts"
      className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2"
      role="group"
    >
      {CHAT_EXAMPLE_PROMPTS.map((prompt) => (
        <Button
          className="h-auto min-h-10 justify-start px-3 py-2 text-left text-xs leading-snug font-normal whitespace-normal text-muted-foreground hover:text-foreground"
          disabled={disabled}
          key={prompt}
          onClick={() => {
            onSelect(prompt)
          }}
          type="button"
          variant="outline"
        >
          {prompt}
        </Button>
      ))}
    </div>
  )
}
