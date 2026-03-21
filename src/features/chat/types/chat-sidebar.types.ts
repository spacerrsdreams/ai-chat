import type { ChatListItem } from "@/features/chat/types/chat-list.types"

export type ChatSidebarActivePage = "chat" | "toolkit"

export type ChatSidebarProps = {
  chats: ChatListItem[]
  activeChatId: string | null
  activePage: ChatSidebarActivePage
  onSelectChat: (id: string) => void
  onNewChat: () => void
  onDeleteChat: (id: string) => void
}
