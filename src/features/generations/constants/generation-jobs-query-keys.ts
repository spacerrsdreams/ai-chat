export const generationJobsQueryKeys = {
  all: ["generation-jobs"] as const,
  list: () => [...generationJobsQueryKeys.all, "list"] as const,
  detail: (id: string) => [...generationJobsQueryKeys.all, "detail", id] as const,
}
