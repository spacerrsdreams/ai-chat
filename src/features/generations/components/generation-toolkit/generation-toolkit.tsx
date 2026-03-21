"use client"

import { GenerationJobSubmitForm } from "@/features/generations/components/generation-job-submit-form/generation-job-submit-form"
import { GenerationJobsFeed } from "@/features/generations/components/generation-jobs-feed/generation-jobs-feed"

export const GenerationToolkit = () => {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-auto px-4 pt-4 pb-2 md:px-6">
        <GenerationJobsFeed />
      </div>
      <div className="shrink-0 bg-background p-4 pt-3">
        <GenerationJobSubmitForm />
      </div>
    </div>
  )
}
