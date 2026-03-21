import { useInfiniteQuery } from "@tanstack/react-query"

import { listGenerationJobsPageApi } from "@/features/generations/api/generation-jobs.api"
import { GENERATION_JOBS_PAGE_SIZE } from "@/features/generations/constants/generation-jobs-page-size"
import { generationJobsQueryKeys } from "@/features/generations/constants/generation-jobs-query-keys"

export function useFetchGenerationJobs() {
  return useInfiniteQuery({
    queryKey: generationJobsQueryKeys.list(),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      listGenerationJobsPageApi({
        offset: pageParam,
        limit: GENERATION_JOBS_PAGE_SIZE,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.offset + lastPage.limit : undefined,
    refetchInterval: (query) => {
      const pages = query.state.data?.pages
      if (!pages) {
        return 2000
      }
      const allJobs = pages.flatMap((p) => p.jobs)
      const hasActive = allJobs.some(
        (job) => job.status === "PENDING" || job.status === "GENERATING"
      )
      return hasActive ? 2000 : false
    },
  })
}
