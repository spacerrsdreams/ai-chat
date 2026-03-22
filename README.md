# AI Chat

## Credentials (read this first)

This project uses API keys tied to real billing for image and text generation through the Vercel AI Gateway. The keys are short-lived and will stop working after about two days. Please use the app lightly—only what you need to review the assignment—so we do not burn through quota or cost. Thank you.

---

## Setup

### Option A: Docker (simplest)

You need Docker and Docker Compose installed.

Put the `.env.docker` file supplied for review in the project root. It must be named exactly `.env.docker`.

From the project folder:

```
docker compose up --build
```

Wait until the log says the app is ready, then open http://localhost:3000 in your browser.

The first start runs database migrations automatically, then starts Next.js. Postgres runs in another container; you do not install Postgres on your machine.

To stop everything, press Ctrl+C in that terminal. To remove the database volume as well, use `docker compose down -v` as appropriate for your setup.

### Option B: Local development

You need [Bun](https://bun.sh) installed (the repo expects Bun as the package manager).

Put the `.env.local` file supplied for review in the project root. It must be named exactly `.env.local`. It should point at your database (for example Neon) and include `AI_GATEWAY_API_KEY` and any `DATABASE_URL` / `DIRECT_URL` values provided.

From the project folder:

```
bun install
```

Generate the Prisma client (this script loads variables from `.env.local`):

```
bun run prisma:generate
```

Apply migrations to your database:

```
bun run prisma:migrate
```

For a deploy-style run against an existing empty database, you can use `bun run prisma:migrate:deploy` when appropriate.

Start the dev server:

```
bun dev
```

Open http://localhost:3000 (Next.js will print the exact URL if the port differs).

Production-style build on your machine:

```
bun run build
bun run start
```

Environment templates for variable names only live in `.env.example` and `.env.docker.example`; real values come from the credentials bundle, not the repo.

---

## Tech stack and rationale

This is a **client-heavy** chat and tooling UI, so the stack favors smooth loading, validation at the edges, and predictable server calls.

| Area                    | Choice                           | Why                                                                                                                                                                                                                                  |
| ----------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Client state            | **Zustand**                      | Lightweight global state where it helps without boilerplate.                                                                                                                                                                         |
| Runtime validation      | **Zod**                          | Validates unknown shapes (API bodies, persistence, params) instead of ad hoc checks.                                                                                                                                                 |
| Server/client data      | **TanStack Query**               | Caching, retries, and background refresh so the app feels responsive during navigation and polling (e.g. async jobs).                                                                                                                |
| UI                      | **shadcn/ui** (Radix + Tailwind) | Accessible primitives we own in-repo; pairs cleanly with **Vercel AI Elements** (`src/components/ai-elements/`) for chat-specific patterns.                                                                                          |
| Chat UX building blocks | **Vercel AI Elements**           | Built to work alongside the **AI SDK** (streaming, tool UIs, prompt patterns).                                                                                                                                                       |
| LLM integration         | **Vercel AI SDK** (`ai`)         | Strong streaming, tools, and provider ecosystem; fits production chat flows.                                                                                                                                                         |
| Routing models          | **Vercel AI Gateway**            | **Fastest** way to integrate models with the AI SDK on **Vercel**; it also brings **strong observability**, a strong **developer experience**, and keys/billing **in one place**—those are upsides, not the main reason we chose it. |
| Database                | **Prisma** + **Neon** (Postgres) | Mature, fast, and reliable for serverless-style Postgres; Prisma fits migrations and type-safe access.                                                                                                                               |

Together, these cover the “main” layers: UI, client data, validation, AI, and persistence without piling on redundant abstractions.

### Coupling everything in one place (pros and cons)

**Pros:** One coherent stack—Next.js on Vercel, AI Gateway, AI SDK, and Neon—means less glue code, faster iteration, and a single mental model for deploys and observability.

**Cons:** You are **tied to that provider surface**. If prices change, limits tighten, or a product direction shifts, migrating off is real work. A more provider-agnostic design (abstract model routing, env-driven providers, optional self-hosted inference) would reduce lock-in at the cost of more plumbing—reasonable next step for a long-lived product.

---

## What the app does

**Core (assignment-aligned):**

- Chat at the home route: prompts, streamed replies, and in-thread image generation via tools.
- Async image/text jobs at `/toolkit`: API returns quickly with a job id; work continues in the background with status **pending → generating → completed / failed**, polling UI, and a grid-style gallery of results plus paginated history.

**Bonus / polish:**

- Empty state with example prompt chips (general and image-style).
- “Thinking” state with a shimmer instead of a bare spinner.
- Sidebar chat history, new chat from the history row, header breadcrumbs.
- Light / dark / system theme control.
- Docker: `Dockerfile`, `docker-compose.yml`, entrypoint that runs migrations before `next start`.

---

## Assignment checklist (mandatory requirements)

- Prompt submission UI: yes—main chat composer plus optional example prompt chips on an empty thread.
- Async job processing where the API does not block until generation finishes: yes—the generation jobs API responds with 202 and a job id; processing continues after the response.
- Job status tracking (pending → generating → completed / failed): yes—shown in the toolkit UI and backed by stored job status.
- Results display (gallery or feed): yes—toolkit shows completed generations in a grid-oriented layout.
- Generation history: yes—paginated listing of past jobs so earlier runs stay visible.
- Error handling: yes—failed jobs and validation errors are surfaced without crashing the flow; invalid prompts get proper API responses where validation applies.
- AI integration: yes—real models through the Vercel AI SDK and gateway when `AI_GATEWAY_API_KEY` is set; see “Real AI vs mock” below for behavior without a key.

---

## What we would improve with more time

- **Authentication and authorization** so sessions, chats, and jobs are not effectively open to anyone who can hit the deployment.
- **Rate limiting** (per IP, per user, and per route) plus **abuse controls** so chat and image endpoints cannot burn through AI quota or **serverless execution** budgets in minutes.
- **Additional security**: stricter input limits, bot protection where it makes sense, secrets rotation, and monitoring/alerts on error and cost spikes.
- **Database and cost guardrails**: query budgets, connection pooling tuned for Neon, and background job concurrency caps so we do not **overload the DB** or queue unbounded work.
- **Fallback models**: if a primary model times out or errors, retry or fail over to a cheaper or more available model instead of a single point of failure.
- **Smoother, more reliable chat navigation**: switching threads (especially before the first generation has even been sent) could feel snappier and less fragile. Next steps might include **Next.js** `cacheComponents: true` where it fits the routing model, **TanStack Query** tuning (`staleTime`, `gcTime`, fetch deduping) so list/detail data stays warm across navigations, and optionally **client-side persistence** for the query cache so revisiting chats reuses work already done in-session.

---

## Real AI vs mock

- **With `AI_GATEWAY_API_KEY` set:** the app uses **real models** through the Vercel AI Gateway and AI SDK (streaming chat, tool calls, and async generation jobs use live text/image generation within configured timeouts).
- **Without a gateway key:** the **async toolkit jobs** intentionally use **placeholder output** (placeholder text and stock-style image URLs) so the UI and DB flow can still be exercised **without spending quota**—useful for local smoke tests or reviewers who should not trigger billed calls. The main chat path is intended to be reviewed with a real key for end-to-end behavior.

---

## Cursor transcripts

Exported Cursor conversation transcripts live under `cursor-transcripts/`. Each markdown file is one session and includes the full chat (user and assistant turns) for that topic, so reviewers can follow how the work was done step by step.
