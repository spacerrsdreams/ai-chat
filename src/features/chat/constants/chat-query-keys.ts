export const chatQueryKeys = {
  chats: () => ["chats"] as const,
  chat: (id: string) => ["chat", id] as const,
}
