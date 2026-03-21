"use client"

import {
  PromptInput,
  type PromptInputMessage,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input"
import { useMutateCreateGenerationJob } from "@/features/generations/hooks/use-mutate-create-generation-job"
import { ApiError } from "@/lib/http-client"
import type { ChatStatus } from "ai"

export const GenerationJobSubmitForm = () => {
  const mutation = useMutateCreateGenerationJob()

  const handleSubmit = async (message: PromptInputMessage) => {
    const text = message.text.trim()
    if (!text || mutation.isPending) {
      return
    }
    await mutation.mutateAsync({ prompt: text, kind: "image" })
  }

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? "Could not queue job"
        : null

  const submitStatus: ChatStatus = mutation.isPending ? "submitted" : "ready"

  return (
    <div className="mx-auto w-full space-y-2">
      <PromptInput className="w-full" onSubmit={handleSubmit}>
        <PromptInputTextarea
          disabled={mutation.isPending}
          placeholder="Ask me anything…"
        />
        <PromptInputFooter>
          <PromptInputTools
            className={
              mutation.isPending ? "pointer-events-none opacity-40" : undefined
            }
          />
          <PromptInputSubmit
            disabled={mutation.isPending}
            status={submitStatus}
          />
        </PromptInputFooter>
      </PromptInput>
      {errorMessage ? (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
