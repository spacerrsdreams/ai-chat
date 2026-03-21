import {
  deleteChat,
  getChatWithMessages,
} from "@/features/chat/repositories/chat.repository"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

type RouteContext = {
  params: Promise<{ chatId: string }>
}

export async function GET(_req: Request, context: RouteContext) {
  const { chatId } = await context.params
  const data = await getChatWithMessages(chatId)
  if (!data) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 })
  }
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, context: RouteContext) {
  const { chatId } = await context.params
  const deleted = await deleteChat(chatId)
  if (!deleted) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 })
  }
  return new NextResponse(null, { status: 204 })
}
