import type { UIMessage } from "ai"

export function isImageGenerationInProgress(messages: UIMessage[]): boolean {
  for (const message of messages) {
    if (message.role !== "assistant") {
      continue
    }
    for (const part of message.parts) {
      if (part.type !== "tool-generateImage") {
        continue
      }
      if (part.state === "output-available" || part.state === "output-error") {
        continue
      }
      return true
    }
  }
  return false
}
