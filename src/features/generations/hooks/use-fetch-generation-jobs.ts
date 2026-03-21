import { useQuery } from "@tanstack/react-query"

import { listGenerationJobsApi } from "@/features/generations/api/generation-jobs.api"
import { generationJobsQueryKeys } from "@/features/generations/constants/generation-jobs-query-keys"

export function useFetchGenerationJobs() {
  return useQuery({
    queryKey: generationJobsQueryKeys.list(),
    queryFn: listGenerationJobsApi,
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) {
        return 2000
      }
      const hasActive = data.some(
        (job) => job.status === "PENDING" || job.status === "GENERATING"
      )
      return hasActive ? 2000 : false
    },
  })
}
