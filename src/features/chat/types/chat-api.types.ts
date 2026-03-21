import type { ChatListItem } from "@/features/chat/types/chat-list.types"
import type { UIMessage } from "ai"

export type ChatsListResponse = {
  chats: ChatListItem[]
}

export type CreateChatResponse = {
  id: string
}

export type GetChatResponse = {
  id: string
  title: string | null
  messages: UIMessage[]
}
