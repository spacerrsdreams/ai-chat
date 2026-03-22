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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import type { ChatSidebarProps } from "@/features/chat/types/chat-sidebar.types"
import { cn } from "@/lib/utils"
import {
  MessageCircleIcon,
  MoreHorizontalIcon,
  PlusIcon,
  Sparkles,
  WandSparklesIcon,
} from "lucide-react"
import Link from "next/link"

export const ChatSidebar = ({
  chats,
  activeChatId,
  activePage,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}: ChatSidebarProps) => {
  return (
    <Sidebar>
      <SidebarHeader className="h-14 shrink-0 flex-row items-center gap-0 border-b p-0 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
            <Sparkles className="size-4" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1 leading-none">
            <span className="truncate text-sm font-medium">AI Chat</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={activePage === "chat"}
                  tooltip="Chat — text + image generation"
                >
                  <Link
                    className={cn("flex w-full items-start gap-2")}
                    href="/"
                  >
                    <MessageCircleIcon className="mt-0.5 size-4 shrink-0" />
                    <span className="grid min-w-0 flex-1 text-left leading-snug">
                      <span className="truncate text-sm font-medium">Chat</span>
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={activePage === "toolkit"}
                  tooltip="Images — queue-based image generations"
                >
                  <Link
                    className={cn("flex w-full items-start gap-2")}
                    href="/toolkit"
                  >
                    <WandSparklesIcon className="mt-0.5 size-4 shrink-0" />
                    <span className="grid min-w-0 flex-1 text-left leading-snug">
                      <span className="truncate text-sm font-medium">
                        Images
                      </span>
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <div
            className={cn(
              "flex h-8 w-full min-w-0 shrink-0 items-center justify-between gap-2 px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear",
              "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0"
            )}
          >
            <span className="min-w-0 truncate">History</span>
            <Button
              aria-label="New chat"
              className="size-8 shrink-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={onNewChat}
              size="icon"
              type="button"
              variant="ghost"
            >
              <PlusIcon className="size-4" />
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.length === 0 && (
                <p className="px-2 text-xs text-muted-foreground">
                  No chats yet. Start a new one from Chat.
                </p>
              )}
              {chats.map((chat) => {
                const label = chat.title?.trim() || "Untitled chat"
                const isActive =
                  activePage === "chat" && activeChatId === chat.id
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
