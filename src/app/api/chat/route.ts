import { CHAT_SYSTEM_PROMPT } from "@/features/chat/constants/chat-system-prompt"
import { chatTools } from "@/features/chat/tools/chat-tools"
import { CHAT_MODEL } from "@/lib/ai"
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai"

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: CHAT_MODEL,
    system: CHAT_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages, { tools: chatTools }),
    tools: chatTools,
    stopWhen: stepCountIs(5),
  })

  return result.toUIMessageStreamResponse()
}
