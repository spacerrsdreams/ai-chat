import { TITLE_MODEL } from "@/lib/ai"
import { generateText } from "ai"

const MAX_INPUT = 4000

export async function generateChatTitleFromUserMessage(
  userMessage: string
): Promise<string> {
  const trimmed = userMessage.trim().slice(0, MAX_INPUT)
  if (!trimmed) {
    return "New chat"
  }

  const { text } = await generateText({
    model: TITLE_MODEL,
    prompt: [
      "You name chat threads for a sidebar. Output a short title only: max 6 words,",
      "no quotes, no punctuation at the end, Title Case or sentence case is fine.",
      "No emojis unless the topic is clearly about them.",
      "",
      "First user message:",
      trimmed,
    ].join("\n"),
  })

  const cleaned = text
    .trim()
    .replace(/^["'«»]+|["'«»]+$/g, "")
    .replace(/\s+/g, " ")
    .slice(0, 120)

  return cleaned.length > 0 ? cleaned : "New chat"
}
