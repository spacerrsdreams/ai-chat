import { z } from "zod"

export const chatPersistenceStateSchema = z.object({
  lastActiveChatId: z.string().nullable(),
})

/** Zustand `persist` JSON envelope in `localStorage`. */
export const persistedChatPersistenceEnvelopeSchema = z.object({
  state: chatPersistenceStateSchema,
  version: z.number().optional(),
})

export type ChatPersistenceState = z.infer<typeof chatPersistenceStateSchema>
