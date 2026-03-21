import { deleteChatApi } from "@/features/chat/api/chats.api"
import { chatQueryKeys } from "@/features/chat/constants/chat-query-keys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useMutateDeleteChat = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteChatApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chatQueryKeys.chats() })
    },
  })
}
