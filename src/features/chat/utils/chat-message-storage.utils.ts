import type { Message as MessageRow } from "@/generated/prisma/client"

const STORAGE_ID_SEP = ":"

/** DB primary key: unique per chat + client id (avoids collisions across chats). */
export function toStorageMessageId(chatId: string, clientMessageId: string): string {
  return `${chatId}${STORAGE_ID_SEP}${clientMessageId}`
}

/** Recover UIMessage.id from a stored row (supports legacy rows where id was only the client id). */
export function toClientMessageId(row: Pick<MessageRow, "id" | "chatId">): string {
  const prefix = `${row.chatId}${STORAGE_ID_SEP}`
  if (row.id.startsWith(prefix)) {
    return row.id.slice(prefix.length)
  }
  return row.id
}
