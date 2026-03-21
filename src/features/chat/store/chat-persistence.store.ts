import {
  CHAT_PERSISTENCE_STORAGE_KEY,
  createChatPersistenceStorage,
} from "@/features/chat/store/chat-persistence.storage"
import type { ChatPersistenceStore } from "@/features/chat/types/chat-persistence.types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useChatPersistenceStore = create<ChatPersistenceStore>()(
  persist(
    (set) => ({
      lastActiveChatId: null,
      setLastActiveChatId: (id) => set({ lastActiveChatId: id }),
      clearLastActiveChatId: () => set({ lastActiveChatId: null }),
    }),
    {
      name: CHAT_PERSISTENCE_STORAGE_KEY,
      partialize: (state) => ({
        lastActiveChatId: state.lastActiveChatId,
      }),
      storage: createChatPersistenceStorage(),
    }
  )
)
