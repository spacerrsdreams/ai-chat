import { prisma } from "@/lib/prisma"
import type { Message as MessageRow } from "@/generated/prisma/client"
import { Prisma } from "@/generated/prisma/client"
import { generateChatTitleFromUserMessage } from "@/features/chat/utils/generate-chat-title"
import {
  toClientMessageId,
  toStorageMessageId,
} from "@/features/chat/utils/chat-message-storage.utils"
import type { UIMessage } from "ai"

function rowToUIMessage(row: MessageRow): UIMessage {
  return {
    id: toClientMessageId(row),
    role: row.role,
    parts: row.parts as UIMessage["parts"],
  }
}

export async function createChat(): Promise<{ id: string }> {
  const chat = await prisma.chat.create({ data: {} })
  return { id: chat.id }
}

export async function chatExists(chatId: string): Promise<boolean> {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    select: { id: true },
  })
  return chat !== null
}

export async function listChats(): Promise<
  Array<{ id: string; title: string | null; updatedAt: Date }>
> {
  return prisma.chat.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, updatedAt: true },
  })
}

export async function deleteChat(chatId: string): Promise<boolean> {
  const result = await prisma.chat.deleteMany({ where: { id: chatId } })
  return result.count > 0
}

export async function getChatWithMessages(
  chatId: string
): Promise<{ id: string; title: string | null; messages: UIMessage[] } | null> {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  })
  if (!chat) {
    return null
  }
  return {
    id: chat.id,
    title: chat.title,
    messages: chat.messages.map(rowToUIMessage),
  }
}

/**
 * The stream may emit the same UIMessage id multiple times as the message is updated
 * (same turn / same bubble). Treat that as one logical message: preserve order of
 * first appearance, keep the latest payload per id.
 */
function dedupeMessagesByIdPreservingOrder(messages: UIMessage[]): UIMessage[] {
  const order: string[] = []
  const byId = new Map<string, UIMessage>()
  for (const m of messages) {
    if (!byId.has(m.id)) {
      order.push(m.id)
    }
    byId.set(m.id, m)
  }
  return order.map((id) => {
    const msg = byId.get(id)
    if (!msg) {
      throw new Error(`Missing message for id ${id}`)
    }
    return msg
  })
}

export async function replaceMessagesForChat(
  chatId: string,
  messages: UIMessage[]
): Promise<void> {
  const uniqueMessages = dedupeMessagesByIdPreservingOrder(messages)
  const rows = uniqueMessages.map((m) => ({
    id: toStorageMessageId(chatId, m.id),
    chatId,
    role: m.role,
    parts: m.parts as Prisma.InputJsonValue,
  }))

  await prisma.$transaction(async (tx) => {
    await tx.message.deleteMany({ where: { chatId } })
    if (rows.length > 0) {
      await tx.message.createMany({
        data: rows,
        skipDuplicates: true,
      })
    }
    await tx.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    })
  })
}

export async function maybeGenerateAiChatTitle(
  chatId: string,
  messages: UIMessage[]
): Promise<void> {
  const chat = await prisma.chat.findUnique({ where: { id: chatId } })
  if (!chat || chat.title) {
    return
  }
  const firstUser = messages.find((m) => m.role === "user")
  if (!firstUser) {
    return
  }
  const textPart = firstUser.parts.find((p) => p.type === "text")
  if (!textPart || textPart.type !== "text") {
    return
  }
  const raw = textPart.text.trim()
  if (!raw) {
    return
  }
  const title = await generateChatTitleFromUserMessage(raw)
  await prisma.chat.update({
    where: { id: chatId },
    data: { title },
  })
}
