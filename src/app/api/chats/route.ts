import {
  createChat,
  listChats,
} from "@/features/chat/repositories/chat.repository"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  const rows = await listChats()
  const chats = rows.map((c) => ({
    id: c.id,
    title: c.title,
    updatedAt: c.updatedAt.toISOString(),
  }))
  return NextResponse.json({ chats })
}

export async function POST() {
  const chat = await createChat()
  return NextResponse.json(chat)
}
