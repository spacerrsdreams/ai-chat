import { DefaultChatTransport } from "ai"

export function createStableChatTransport() {
  let chatId: string | null = null

  const transport = new DefaultChatTransport({
    api: "/api/chat",
    body: () => {
      if (!chatId) {
        throw new Error("Missing chat id")
      }
      return { chatId }
    },
    credentials: "same-origin",
  })

  return {
    transport,
    getChatId() {
      return chatId
    },
    setChatId(next: string | null) {
      chatId = next
    },
  }
}
