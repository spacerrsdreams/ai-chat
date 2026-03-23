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
    generationJobs: {
      list: (offset: number, limit: number) => {
        const params = new URLSearchParams({
          offset: String(offset),
          limit: String(limit),
        })
        return `/api/generation-jobs?${params.toString()}`
      },
      create: "/api/generation-jobs",
      get: (jobId: string) => `/api/generation-jobs/${jobId}`,
    },
  },
  web: {
    home: "/",
    chat: "/chat",
    chatById: (id: string) => `/chat/${id}`,
  },
} as const
