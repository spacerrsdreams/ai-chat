import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

declare global {
  var prisma: PrismaClient | undefined;
  var prismaAdapter: PrismaNeon | undefined;
}

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
