import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import type { ChatListItem } from "@/features/chat/types/chat-list.types"
import { MessageSquareIcon, MoreHorizontalIcon, PlusIcon } from "lucide-react"

type ChatSidebarProps = {
  chats: ChatListItem[]
  activeChatId: string | null
  onSelectChat: (id: string) => void
  onNewChat: () => void
  onDeleteChat: (id: string) => void
}

export const ChatSidebar = ({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: ChatSidebarProps) => {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <MessageSquareIcon className="size-4" />
          </div>
          <div className="min-w-0 flex-1 leading-none">
            <span className="truncate font-medium">Chats</span>
          </div>
          <Button
            aria-label="New chat"
            className="size-8 shrink-0"
            onClick={onNewChat}
            size="icon"
            type="button"
            variant="ghost"
          >
            <PlusIcon className="size-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.length === 0 && (
                <p className="px-2 text-xs text-muted-foreground">
                  No chats yet. Start a new one.
                </p>
              )}
              {chats.map((chat) => {
                const label = chat.title?.trim() || "Untitled chat"
                const isActive = activeChatId === chat.id
                return (
                  <SidebarMenuItem className="group/menu-item" key={chat.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => {
                        onSelectChat(chat.id)
                      }}
                      tooltip={label}
                    >
                      <span className="truncate">{label}</span>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction
                          aria-label="Chat actions"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                          showOnHover
                        >
                          <MoreHorizontalIcon />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            onDeleteChat(chat.id)
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
