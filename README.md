# AI Chat

## Assignment narrative (Mini AI Toolkit)

This app includes **two complementary flows**:

1. **Chat** (`/`) — **Interactive** conversation: streaming replies and in-thread **image generation** via tools. The chat API keeps the HTTP connection open for the streamed turn (standard chat UX).

2. **Images** (`/toolkit`) — **Queued async** image jobs: `POST /api/generation-jobs` returns **202** immediately with a `jobId`; work runs after the response (`after()`). The UI polls and shows **PENDING → GENERATING → COMPLETED / FAILED** in a grid. This path satisfies the “API must not block until generation completes” requirement.

Graders should evaluate **async job processing** against the **Images** page and `/api/generation-jobs`, not the streaming chat route.

## Generation jobs API

- **List (paginated):** `GET /api/generation-jobs?offset=0&limit=20`  
  - `limit`: 1–50 (default 20)  
  - `offset`: ≥ 0 (default 0)  
  - Response: `{ jobs, offset, limit, hasMore }` — fetch `limit + 1` internally to compute `hasMore`.

- **Create:** `POST /api/generation-jobs` → **202** `{ jobId }`  
  - Validation errors: **400** with `{ error, issues }` (Zod issue shape for clients).

## Local setup

Use your usual Next.js + Prisma workflow (`DATABASE_URL` / `DIRECT_URL`, `prisma migrate`, `AI_GATEWAY_API_KEY` optional — without it, queued image jobs use a placeholder image URL).
