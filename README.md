# AI Chat

## Credentials (read this first)

Those project contains API keys tied to real billing for image and text generation through the Vercel AI gateway. The keys are short-lived and will stop working after about two days. Please use the app lightly—only what you need to review the assignment—so we do not burn through quota or cost. Thank you.

---

## Way 1: Run with Docker (Simplest)

You need Docker and Docker Compose installed.

Put the `.env.docker` file I emailed you in the project root. It must be named exactly `.env.docker`.

Then in a terminal, from the project folder:

```
docker compose up --build
```

Wait until the log says the app is ready. Open http://localhost:3000 in your browser.

The first start runs database migrations automatically, then starts Next.js. Postgres runs in another container; you do not install Postgres on your machine.

To stop everything, press Ctrl+C in that terminal. If you want to remove the database volume as well, look up `docker compose down -v` for your setup.

---

## Way 2: Run locally for development

You need Bun installed (the repo expects Bun as the package manager).

Put the `.env.local` file I emailed you in the project root. It must be named exactly `.env.local`. It should point at your database (for example Neon) and include `AI_GATEWAY_API_KEY` and any `DATABASE_URL` / `DIRECT_URL` values I gave you.

From the project folder, run:

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

If you prefer a one-shot deploy style against an existing empty database, you can use `bun run prisma:migrate:deploy` instead when appropriate.

Start the dev server:

```
bun dev
```

Open http://localhost:3000 (Next.js will print the exact URL if the port differs).

For a production-style build on your machine:

```
bun run build
bun run start
```

---

## What this project does (features)

Chat at the home route: you type prompts, get streamed text replies, and the assistant can call image generation inside the same conversation. There is an empty state with example prompts (mix of general questions and image-style asks), a “thinking” state with a shimmer instead of a bare spinner, chat history in the sidebar, new chat from the History row, breadcrumbs in the header, and a light / dark / system theme control in the top right.

Images toolkit at `/toolkit`: queued image jobs. Creating a job returns quickly with a job id; work continues in the background. The UI polls and shows status moving from pending through generating to completed or failed, and shows finished images in a grid-style layout with access to past jobs.

Docker support: `Dockerfile`, `docker-compose.yml`, and an entrypoint that runs migrations before `next start`. Example env templates live in `.env.example` and `.env.docker.example` for names of variables only—real values come from the email.

---

## Assignment checklist (mandatory requirements)

Prompt submission UI: yes—main chat composer plus optional example prompt chips on an empty thread.

Async job processing where the API does not block until generation finishes: yes—the generation jobs API responds with 202 and a job id; processing continues after the response.

Job status tracking (pending → generating → completed / failed): yes—shown in the toolkit UI and backed by stored job status.

Results display (gallery or feed): yes—toolkit shows completed generations in a grid-oriented layout.

Generation history: yes—paginated listing of past jobs so earlier runs stay visible.

Error handling: yes—failed jobs and validation errors are surfaced without crashing the flow; invalid prompts get proper API responses where validation applies.

AI integration: yes—real models through the Vercel AI SDK gateway when `AI_GATEWAY_API_KEY` is set; behavior without a key is documented in code paths as appropriate for local or missing-config cases.
