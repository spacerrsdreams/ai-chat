import { persistedChatPersistenceEnvelopeSchema } from "@/features/chat/schemas/chat-persistence.schema"
import type { ChatPersistenceState } from "@/features/chat/types/chat-persistence.types"
import type { PersistStorage } from "zustand/middleware"

export const CHAT_PERSISTENCE_STORAGE_KEY = "ai-chat-persistence"

export function createChatPersistenceStorage(): PersistStorage<ChatPersistenceState> {
  return {
    getItem: (name) => {
      if (typeof window === "undefined") {
        return null
      }
      const raw = window.localStorage.getItem(name)
      if (!raw) {
        return null
      }
      let parsed: unknown
      try {
        parsed = JSON.parse(raw)
      } catch {
        return null
      }
      const result = persistedChatPersistenceEnvelopeSchema.safeParse(parsed)
      if (!result.success) {
        return null
      }
      return result.data
    },
    setItem: (name, value) => {
      if (typeof window === "undefined") {
        return
      }
      window.localStorage.setItem(name, JSON.stringify(value))
    },
    removeItem: (name) => {
      if (typeof window === "undefined") {
        return
      }
      window.localStorage.removeItem(name)
    },
  }
}
