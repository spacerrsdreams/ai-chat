import { createGateway } from "@ai-sdk/gateway"

export const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
})

export const CHAT_MODEL = "openai/gpt-4o-mini" as const
export const TITLE_MODEL = "openai/gpt-4o-mini" as const
export const IMAGE_MODEL = "openai/gpt-image-1" as const
