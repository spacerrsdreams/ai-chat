# syntax=docker/dockerfile:1
# Build: bun install → prisma generate → next build (no DB required).
# Run:  entrypoint loads .env.docker → prisma migrate deploy → next start (needs DB).

FROM oven/bun:1-debian AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY package.json bun.lock ./
COPY prisma.config.ts ./
COPY prisma ./prisma
COPY tsconfig.json ./
COPY next.config.mjs ./
COPY postcss.config.mjs ./
COPY eslint.config.mjs ./
COPY components.json ./
COPY src ./src
COPY public ./public
# No live DB during build: placeholders satisfy prisma.config (DIRECT_URL) and app code that
# imports @/lib/prisma during `next build` (DATABASE_URL). Runtime uses real URLs from .env.docker.
ENV DIRECT_URL=postgresql://docker:docker@127.0.0.1:5432/docker
ENV DATABASE_URL=postgresql://docker:docker@127.0.0.1:5432/docker
RUN bun x prisma generate && bun run build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock
COPY .env.docker ./.env.docker
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
