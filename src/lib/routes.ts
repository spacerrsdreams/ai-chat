export const routes = {
  api: {
    chats: {
      list: "/api/chats",
      create: "/api/chats",
      get: (id: string) => `/api/chats/${id}`,
      delete: (id: string) => `/api/chats/${id}`,
      messages: (id: string) => `/api/chats/${id}/messages`,
      title: (id: string) => `/api/chats/${id}/title`,
    },
  },
  web: {
    home: "/",
    chat: "/chat",
    chatById: (id: string) => `/chat/${id}`,
  },
} as const
