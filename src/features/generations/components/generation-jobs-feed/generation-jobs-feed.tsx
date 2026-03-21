"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { GenerationJobCard } from "@/features/generations/components/generation-job-card/generation-job-card"
import { useFetchGenerationJobs } from "@/features/generations/hooks/use-fetch-generation-jobs"

export const GenerationJobsFeed = () => {
  const query = useFetchGenerationJobs()
  const jobs = query.data?.pages.flatMap((page) => page.jobs) ?? []

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

  if (jobs.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No jobs yet. Add a prompt below to queue one.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[repeat(auto-fill,280px)] justify-center gap-4 sm:justify-start">
        {jobs.map((job) => (
          <GenerationJobCard job={job} key={job.id} />
        ))}
      </div>
      {query.hasNextPage ? (
        <div className="flex justify-center pb-2">
          <Button
            disabled={query.isFetchingNextPage}
            onClick={() => {
              void query.fetchNextPage()
            }}
            type="button"
            variant="outline"
          >
            {query.isFetchingNextPage ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-4" />
                Loading…
              </span>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
