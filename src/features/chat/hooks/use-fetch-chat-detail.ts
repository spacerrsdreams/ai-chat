import { getChatApi } from "@/features/chat/api/chats.api"
import { chatQueryKeys } from "@/features/chat/constants/chat-query-keys"
import { useQuery } from "@tanstack/react-query"

export const useFetchChatDetail = (chatId: string | null) => {
  return useQuery({
    queryKey: chatQueryKeys.chat(chatId ?? ""),
    queryFn: () => getChatApi(chatId!),
    enabled: !!chatId,
  })
}
