import "server-only"

import { generateImage, generateText } from "ai"

import {
  completeGenerationJobImage,
  completeGenerationJobText,
  failGenerationJob,
  getGenerationJobById,
  markGenerationJobGenerating,
} from "@/features/generations/repositories/generation-job.repository"
import { CHAT_MODEL, gateway, IMAGE_MODEL } from "@/lib/ai"

const mockDelayMs = () => 1000 + Math.floor(Math.random() * 4000)

const loremFallback =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."

function hasAiGatewayKey(): boolean {
  return Boolean(process.env.AI_GATEWAY_API_KEY?.trim())
}

export async function runGenerationJob(jobId: string): Promise<void> {
  const job = await getGenerationJobById(jobId)
  if (!job) {
    return
  }
  if (job.status !== "PENDING") {
    return
  }

  await markGenerationJobGenerating(jobId)

  try {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, mockDelayMs())
    })

    if (job.kind === "image") {
      if (hasAiGatewayKey()) {
        const result = await generateImage({
          model: gateway.imageModel(IMAGE_MODEL),
          prompt: job.prompt,
          abortSignal: AbortSignal.timeout(120_000),
        })
        const image = result.image
        const url = `data:${image.mediaType};base64,${image.base64}`
        await completeGenerationJobImage({ id: jobId, resultUrl: url })
      } else {
        const url = `https://picsum.photos/seed/${encodeURIComponent(jobId)}/800/600`
        await completeGenerationJobImage({ id: jobId, resultUrl: url })
      }
      return
    }

    if (hasAiGatewayKey()) {
      const { text } = await generateText({
        model: CHAT_MODEL,
        prompt: job.prompt,
        abortSignal: AbortSignal.timeout(90_000),
      })
      await completeGenerationJobText({ id: jobId, resultText: text })
    } else {
      await completeGenerationJobText({
        id: jobId,
        resultText: `${loremFallback}\n\n(Prompt: ${job.prompt.slice(0, 200)}${job.prompt.length > 200 ? "…" : ""})`,
      })
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Generation failed unexpectedly"
    await failGenerationJob({ id: jobId, errorMessage: message })
  }
}
