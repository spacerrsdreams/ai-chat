import { listChatsApi } from "@/features/chat/api/chats.api"
import { chatQueryKeys } from "@/features/chat/constants/chat-query-keys"
import { useQuery } from "@tanstack/react-query"

export const useFetchChats = () => {
  return useQuery({
    queryKey: chatQueryKeys.chats(),
    queryFn: listChatsApi,
  })
}
