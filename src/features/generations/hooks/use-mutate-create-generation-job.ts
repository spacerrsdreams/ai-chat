import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createGenerationJobApi } from "@/features/generations/api/generation-jobs.api"
import { generationJobsQueryKeys } from "@/features/generations/constants/generation-jobs-query-keys"
import type { CreateGenerationJobBody } from "@/features/generations/types/generation-job.types"

export function useMutateCreateGenerationJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateGenerationJobBody) => createGenerationJobApi(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: generationJobsQueryKeys.list(),
      })
    },
  })
}
