"use client"

import { ChatShell } from "@/features/chat/components/chat-shell/chat-shell"
import { ChatSidebar } from "@/features/chat/components/chat-sidebar/chat-sidebar"
import { chatQueryKeys } from "@/features/chat/constants/chat-query-keys"
import { useFetchChats } from "@/features/chat/hooks/use-fetch-chats"
import { useMutateDeleteChat } from "@/features/chat/hooks/use-mutate-delete-chat"
import { useChatPersistenceStore } from "@/features/chat/store/chat-persistence.store"
import { GenerationToolkit } from "@/features/generations/components/generation-toolkit/generation-toolkit"
import { Spinner } from "@/components/ui/spinner"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

export const ToolkitPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const chatsQuery = useFetchChats()
  const deleteChatMutation = useMutateDeleteChat()

  const chats = chatsQuery.data ?? []

  const handleSelectChat = useCallback(
    (id: string) => {
      useChatPersistenceStore.getState().setLastActiveChatId(id)
      router.push("/")
    },
    [router]
  )

  const handleNewChat = useCallback(() => {
    useChatPersistenceStore.getState().clearLastActiveChatId()
    router.push("/")
  }, [router])

  const handleDeleteChat = useCallback(
    async (id: string) => {
      try {
        await deleteChatMutation.mutateAsync(id)
      } catch {
        return
      }
      queryClient.removeQueries({ queryKey: chatQueryKeys.chat(id) })
      if (useChatPersistenceStore.getState().lastActiveChatId === id) {
        useChatPersistenceStore.getState().clearLastActiveChatId()
      }
    },
    [deleteChatMutation, queryClient]
  )

  if (chatsQuery.isError) {
    return (
      <div className="flex h-svh items-center justify-center p-6 text-sm text-destructive">
        Could not load chats.
      </div>
    )
  }

  if (chatsQuery.isPending) {
    return (
      <div className="flex h-svh items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  return (
    <ChatShell
      breadcrumbTitle="Toolkit"
      sidebar={
        <ChatSidebar
          activeChatId={null}
          activePage="toolkit"
          chats={chats}
          onDeleteChat={(id) => {
            void handleDeleteChat(id)
          }}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
        />
      }
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <GenerationToolkit />
      </div>
    </ChatShell>
  )
}
