import type { ChatPersistenceState } from "@/features/chat/schemas/chat-persistence.schema"

export type { ChatPersistenceState }

export type ChatPersistenceActions = {
  setLastActiveChatId: (id: string | null) => void
  clearLastActiveChatId: () => void
}

export type ChatPersistenceStore = ChatPersistenceState & ChatPersistenceActions
