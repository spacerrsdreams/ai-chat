"use client"

import { Spinner } from "@/components/ui/spinner"
import { GenerationJobCard } from "@/features/generations/components/generation-job-card/generation-job-card"
import { useFetchGenerationJobs } from "@/features/generations/hooks/use-fetch-generation-jobs"

export const GenerationJobsFeed = () => {
  const query = useFetchGenerationJobs()

  if (query.isPending) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (query.isError) {
    return (
      <p className="py-8 text-center text-sm text-destructive">
        Could not load generation jobs.
      </p>
    )
  }

  const jobs = query.data ?? []
  if (jobs.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No jobs yet. Add a prompt below to queue one.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,280px)] justify-center gap-4 sm:justify-start">
      {jobs.map((job) => (
        <GenerationJobCard job={job} key={job.id} />
      ))}
    </div>
  )
}
