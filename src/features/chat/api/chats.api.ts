import type {
  ChatsListResponse,
  CreateChatResponse,
  GetChatResponse,
} from "@/features/chat/types/chat-api.types"
import type { ChatListItem } from "@/features/chat/types/chat-list.types"
import { apiRequest } from "@/lib/http-client"

export async function listChatsApi(): Promise<ChatListItem[]> {
  const res = await apiRequest<ChatsListResponse>("/api/chats")
  return res.chats
}

export async function createChatApi(): Promise<CreateChatResponse> {
  return apiRequest<CreateChatResponse>("/api/chats", { method: "POST" })
}

export async function getChatApi(id: string): Promise<GetChatResponse> {
  return apiRequest<GetChatResponse>(`/api/chats/${id}`)
}

export async function deleteChatApi(id: string): Promise<void> {
  await apiRequest<unknown>(`/api/chats/${id}`, { method: "DELETE" })
}
