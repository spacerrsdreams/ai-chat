"use client"

import { useChatPersistenceStore } from "@/features/chat/store/chat-persistence.store"
import { useEffect, useState } from "react"

export const useChatPersistenceHydrated = () => {
  const [hydrated, setHydrated] = useState(() =>
    useChatPersistenceStore.persist.hasHydrated()
  )

  useEffect(() => {
    if (useChatPersistenceStore.persist.hasHydrated()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHydrated(true)
      return
    }
    const unsub = useChatPersistenceStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })
    return unsub
  }, [])

  return hydrated
}
