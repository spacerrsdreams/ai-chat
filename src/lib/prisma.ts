import "server-only"

import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/generated/prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL?.trim()
  if (!url) {
    throw new Error("DATABASE_URL is required")
  }

  const forceNeon = process.env.PRISMA_USE_NEON === "true"
  const forcePg = process.env.PRISMA_USE_NEON === "false"
  const hostLooksNeon =
    url.includes("neon.tech") || url.includes("neon.database")

  const useNeon = forceNeon || (!forcePg && hostLooksNeon)

  if (useNeon) {
    return new PrismaClient({
      adapter: new PrismaNeon({ connectionString: url }),
    })
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: url }),
  })
}

export const prisma = globalThis.prisma ?? createPrismaClient()
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma
}
