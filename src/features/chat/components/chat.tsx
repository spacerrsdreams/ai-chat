"use client"

import { ChatSession } from "@/features/chat/components/chat-session/chat-session"
import { ChatShell } from "@/features/chat/components/chat-shell/chat-shell"
import { ChatSidebar } from "@/features/chat/components/chat-sidebar/chat-sidebar"
import { chatQueryKeys } from "@/features/chat/constants/chat-query-keys"
import { useChatPersistenceHydrated } from "@/features/chat/hooks/use-chat-persistence-hydrated"
import { useFetchChatDetail } from "@/features/chat/hooks/use-fetch-chat-detail"
import { useFetchChats } from "@/features/chat/hooks/use-fetch-chats"
import { useMutateDeleteChat } from "@/features/chat/hooks/use-mutate-delete-chat"
import { useChatPersistenceStore } from "@/features/chat/store/chat-persistence.store"
import { Spinner } from "@/components/ui/spinner"
import { useQueryClient } from "@tanstack/react-query"
import type { UIMessage } from "ai"
import { useCallback, useEffect, useRef, useState } from "react"

export const Chat = () => {
  const queryClient = useQueryClient()
  const chatsQuery = useFetchChats()
  const deleteChatMutation = useMutateDeleteChat()
  const persistHydrated = useChatPersistenceHydrated()

  const [routingReady, setRoutingReady] = useState(false)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [sessionClientId, setSessionClientId] = useState("")
  const bootstrapDoneRef = useRef(false)

  const chatDetailQuery = useFetchChatDetail(activeChatId)

  const chats = chatsQuery.data ?? []

  const hydratedFromServer = !!activeChatId && sessionClientId === activeChatId

  const initialMessages: UIMessage[] =
    hydratedFromServer && chatDetailQuery.data
      ? chatDetailQuery.data.messages
      : []

  const startNewDraft = useCallback(() => {
    setActiveChatId(null)
    setSessionClientId(crypto.randomUUID())
    useChatPersistenceStore.getState().clearLastActiveChatId()
  }, [])

  const loadChat = useCallback((id: string) => {
    setActiveChatId(id)
    setSessionClientId(id)
    useChatPersistenceStore.getState().setLastActiveChatId(id)
  }, [])

  useEffect(() => {
    if (!activeChatId || !chatDetailQuery.isError) {
      return
    }
    queueMicrotask(() => {
      const persisted = useChatPersistenceStore.getState().lastActiveChatId
      if (persisted === activeChatId) {
        useChatPersistenceStore.getState().clearLastActiveChatId()
      }
      startNewDraft()
    })
  }, [activeChatId, chatDetailQuery.isError, startNewDraft])

  useEffect(() => {
    if (!persistHydrated) {
      return
    }
    if (chatsQuery.isPending || chatsQuery.isError) {
      return
    }
    if (!chatsQuery.isSuccess || bootstrapDoneRef.current) {
      return
    }
    bootstrapDoneRef.current = true

    const list = chatsQuery.data ?? []
    const stored = useChatPersistenceStore.getState().lastActiveChatId

    queueMicrotask(() => {
      if (stored && list.some((c) => c.id === stored)) {
        setActiveChatId(stored)
        setSessionClientId(stored)
      } else {
        if (stored) {
          useChatPersistenceStore.getState().clearLastActiveChatId()
        }
        setActiveChatId(null)
        setSessionClientId(crypto.randomUUID())
      }
      setRoutingReady(true)
    })
  }, [
    persistHydrated,
    chatsQuery.data,
    chatsQuery.isError,
    chatsQuery.isPending,
    chatsQuery.isSuccess,
  ])

  const handleSelectChat = useCallback(
    (id: string) => {
      loadChat(id)
    },
    [loadChat]
  )

  const handleNewChat = useCallback(() => {
    startNewDraft()
  }, [startNewDraft])

  const handleChatCreated = useCallback((id: string) => {
    setActiveChatId(id)
    useChatPersistenceStore.getState().setLastActiveChatId(id)
  }, [])

  const handleDeleteChat = useCallback(
    async (id: string) => {
      try {
        await deleteChatMutation.mutateAsync(id)
      } catch {
        return
      }
      queryClient.removeQueries({ queryKey: chatQueryKeys.chat(id) })
      if (activeChatId === id) {
        startNewDraft()
      }
      if (useChatPersistenceStore.getState().lastActiveChatId === id) {
        useChatPersistenceStore.getState().clearLastActiveChatId()
      }
    },
    [activeChatId, deleteChatMutation, queryClient, startNewDraft]
  )

  const breadcrumbTitle =
    activeChatId === null
      ? "New chat"
      : chats.find((c) => c.id === activeChatId)?.title?.trim() ||
        "Untitled chat"

  const waitingForChatDetail =
    !!activeChatId && hydratedFromServer && chatDetailQuery.isPending
  const uiReady = routingReady && !waitingForChatDetail

  if (chatsQuery.isError) {
    return (
      <div className="flex h-svh items-center justify-center p-6 text-sm text-destructive">
        Could not load chats.
      </div>
    )
  }

  if (!uiReady || !sessionClientId) {
    return (
      <div className="flex h-svh items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  return (
    <ChatShell
      breadcrumbTitle={breadcrumbTitle}
      sidebar={
        <ChatSidebar
          activeChatId={activeChatId}
          chats={chats}
          onDeleteChat={(id) => {
            void handleDeleteChat(id)
          }}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
        />
      }
    >
      <ChatSession
        initialDbChatId={activeChatId}
        initialMessages={initialMessages}
        key={sessionClientId}
        onChatCreated={handleChatCreated}
        onConversationUpdated={() => {
          void queryClient.invalidateQueries({
            queryKey: chatQueryKeys.chats(),
          })
          if (activeChatId) {
            void queryClient.invalidateQueries({
              queryKey: chatQueryKeys.chat(activeChatId),
            })
          }
        }}
        sessionClientId={sessionClientId}
      />
    </ChatShell>
  )
}
