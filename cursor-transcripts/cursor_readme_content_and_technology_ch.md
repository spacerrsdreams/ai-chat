# README content and technology choices
_Exported on 22/03/2026 at 14:38:04 GMT+4 from Cursor (2.6.19)_

---

**User**

3. README in the Repo

Include: setup instructions, tech choices rationale, what you'd improve with more time, bonus features added, and whether you used real AI or mock (and why).



now about this basically say that we should have used auth, rate limiting, additional seecurity features so we could avoid burning money and bombing db or serverless functions  also we could use  fallback ai models if any of it would time out or die.

about the features 

we used main ones 

zustand zod tantack-query ( because this kind of apps are more clientish we had to make sure it will feels smooth) Shadcn because it has compatibility with ai-vercel elements pre built components 

and I used ai-vercel components because its compatioble with ai-sdk and we used ai-sdk because its one of the best in the wild and Plus we used ai-vercel-gateway

Since we are deploying it vercel 

Alos explain that pros and cons coupling everything in one place. Good thingi s that everything is one place but bad is that ur caged and stuck with one provider which if tehy increase prices we are fucked or change somethign dramatically

also we used prisma with neon since both of them are very mature fast and efficent reliable 





---

**Cursor**


Reading the README and project setup so we can update it with accurate setup steps and aligned tech narrative.




Checking how AI is invoked when the gateway key is missing so we describe real vs mock accurately.




Updating the README: preserving setup and checklist, and adding tech rationale, coupling trade-offs, future improvements, bonus features, and an accurate real-AI vs mock section (toolkit has explicit fallbacks; chat uses the gateway when configured).




Here’s what changed in `README.md`:

### Structure
- **Setup** — Same Docker vs local flow, clearer headings; env template note kept.
- **Tech stack and rationale** — Table for Zustand, Zod, TanStack Query, shadcn + AI Elements, AI SDK, Vercel AI Gateway, Prisma + Neon, with short “why” for each.
- **Coupling pros/cons** — One place / fast iteration vs vendor lock-in, pricing, and product changes.
- **What the app does** — Split into **core (assignment)** vs **bonus/polish** (empty state, shimmer, sidebar, theme, Docker).
- **Assignment checklist** — Unchanged substance; AI bullet now points to the real vs mock section.
- **What we would improve with more time** — Auth, rate limiting, broader security, DB/cost/serverless guardrails, fallback models when the primary fails or times out.
- **Real AI vs mock** — Real path when `AI_GATEWAY_API_KEY` is set; toolkit **placeholders** without a key so you can demo flows without spend (aligned with `run-generation-job.service.ts`).

The **credentials / billing** warning at the top is unchanged. **Cursor transcripts** path is still `cursor-transcripts/` as in your original README. If that folder name differs on disk, say what it should be and we can fix it.

