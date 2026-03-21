import { generationJobPostErrorBodySchema } from "@/features/generations/schemas/generation-job-post-error.schema"
import { ApiError } from "@/lib/http-client"

export type GenerationJobMutationErrorDisplay = {
  summary: string
  issues: { message: string; pathLabel: string }[]
}

export function getGenerationJobMutationErrorDisplay(
  error: unknown
): GenerationJobMutationErrorDisplay | null {
  if (!error) {
    return null
  }
  if (error instanceof ApiError) {
    if (error.status === 400) {
      const parsed = generationJobPostErrorBodySchema.safeParse(error.data)
      const rawIssues = parsed.success ? (parsed.data.issues ?? []) : []
      const issues = rawIssues.map((issue) => ({
        message: issue.message,
        pathLabel:
          issue.path && issue.path.length > 0
            ? issue.path.map(String).join(".")
            : "",
      }))
      const summaryFromBody =
        parsed.success && parsed.data.error?.trim()
          ? parsed.data.error.trim()
          : null
      return {
        summary: summaryFromBody ?? error.message,
        issues,
      }
    }
    return { summary: error.message, issues: [] }
  }
  return {
    summary:
      error instanceof Error ? error.message : "Could not queue job",
    issues: [],
  }
}
