import { CHAT_SYSTEM_PROMPT } from "@/features/chat/constants/chat-system-prompt"
import {
  chatExists,
  maybeGenerateAiChatTitle,
  replaceMessagesForChat,
} from "@/features/chat/repositories/chat.repository"
import { chatTools } from "@/features/chat/tools/chat-tools"
import { CHAT_MODEL } from "@/lib/ai"
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai"
import { z } from "zod"

export const runtime = "nodejs"

const requestSchema = z.object({
  chatId: z.string().min(1),
  messages: z.array(z.unknown()),
})

export async function POST(req: Request) {
  const parsed = requestSchema.safeParse(await req.json())

  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "Invalid body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { chatId, messages: rawMessages } = parsed.data
  const exists = await chatExists(chatId)

  if (!exists) {
    return new Response(JSON.stringify({ error: "Chat not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  const messages = rawMessages as UIMessage[]

  const result = streamText({
    model: CHAT_MODEL,
    system: CHAT_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages, { tools: chatTools }),
    tools: chatTools,
    stopWhen: stepCountIs(5),
  })

  // Persist the finalized *UI* thread (`UIMessage[]` with tool parts, etc.). The UI stream’s
  // `onFinish` merges `originalMessages` with the completed assistant message — the shape
  // we store. `streamText`’s own `onFinish` receives model-level `StepResult` / `response.messages`,
  // not `UIMessage[]`, so it is not a drop-in replacement without a separate conversion layer.
  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: async ({ messages: finalMessages }) => {
      await replaceMessagesForChat(chatId, finalMessages)
      await maybeGenerateAiChatTitle(chatId, finalMessages)
    },
  })
}
