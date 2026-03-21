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
import { getGenerationJobMutationErrorDisplay } from "@/features/generations/utils/generation-job-mutation-error.utils"
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

  const errorDisplay = getGenerationJobMutationErrorDisplay(mutation.error)

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
      {errorDisplay ? (
        <div className="space-y-1 text-sm text-destructive" role="alert">
          <p>{errorDisplay.summary}</p>
          {errorDisplay.issues.length > 0 ? (
            <ul className="list-inside list-disc space-y-0.5 text-xs">
              {errorDisplay.issues.map((issue, index) => (
                <li key={`${issue.pathLabel}-${issue.message}-${index}`}>
                  {issue.pathLabel
                    ? `${issue.pathLabel}: ${issue.message}`
                    : issue.message}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
