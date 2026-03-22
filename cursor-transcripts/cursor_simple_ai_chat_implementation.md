# Simple AI chat implementation
_Exported on 22/03/2026 at 14:22:50 GMT+4 from Cursor (2.6.19)_

---

**User**

lets implement simplest AI CHAT with ability to STOP show loading and stream and send messages nothing else.

We should strictly use shadcn components and vercel ai-elements and vercel ai-sdk 



---

**Cursor**

Let me check the relevant AI elements and the existing AI lib setup.

Now I have everything I need. Let me plan and implement the chat feature.

Good - `@ai-sdk/gateway` is available via the lock file. Now let me implement everything.

Done. Here's what was built across 3 files:

**`src/app/api/chat/route.ts`** — Edge runtime POST handler using `streamText` from the AI SDK, piped through `toDataStreamResponse()`.

**`src/features/chat/components/chat.tsx`** — The full chat UI wired to `useChat` from `@ai-sdk/react`:
- **Send** — `PromptInput` / `PromptInputTextarea` handle the textarea, Enter key, and form submit; calls `append` to add the user message.
- **Stream** — `MessageResponse` wraps `Streamdown` (a streaming markdown renderer); `isAnimating` is set only on the last assistant message while `status === "streaming"`.
- **Loading** — when `status === "submitted"` (waiting for first token) a spinner appears as a placeholder assistant message.
- **Stop** — `PromptInputSubmit` automatically switches its icon to a stop square and calls `stop()` when generating; no extra code needed.

**`src/app/page.tsx`** — thin route, just renders `<Chat />`.

Make sure `AI_GATEWAY_API_KEY` is set in `.env.local` before testing.

---

**User**

For the code present, we get this error:
```
Property 'append' does not exist on type 'UseChatHelpers<UIMessage<unknown, UIDataTypes, UITools>>'.
```
Fix it, verify, and then give a concise explanation. @src/features/chat/components/chat.tsx:25-28 

@route.ts (1) 


---

**Cursor**

The issue is clear. In `@ai-sdk/react` v3, `append` doesn't exist — the correct method is `sendMessage`, which accepts `{ text: string }`.

In AI SDK v6, `useChat` no longer accepts `api` directly — it needs a `transport`. I need to pass a `DefaultChatTransport` with the API URL. I'll define it at module level to avoid recreation on every render.

Clean. Here's the final state of the component:

```7:30:src/features/chat/components/chat.tsx
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { MessageSquareIcon } from "lucide-react"

const transport = new DefaultChatTransport({ api: "/api/chat" })

export const Chat = () => {
  const { messages, sendMessage, status, stop } = useChat({ transport })

  const isGenerating = status === "submitted" || status === "streaming"
  const lastIndex = messages.length - 1

  const handleSubmit = ({ text }: { text: string }) => {
    if (!text.trim() || isGenerating) return
    void sendMessage({ text })
  }
```

**Two fixes, both caused by AI SDK v6's revised API:**

1. **`append` → `sendMessage`** — `UseChatHelpers` in v3 of `@ai-sdk/react` picks only `sendMessage` (and a handful of others) from `AbstractChat`. `append` simply doesn't exist on this type anymore. `sendMessage({ text })` is the direct replacement for sending a user message.

2. **`{ api }` → `{ transport }`** — `useChat` no longer accepts `api` as a top-level option. Configuration is now done via a `transport` object (`DefaultChatTransport`, `HttpChatTransport`, etc.). The transport is created once at module scope so it isn't recreated on every render.

---

**User**

For the code present, we get this error:
```
Property 'toDataStreamResponse' does not exist on type 'StreamTextResult<ToolSet, Output<string, string, never>>'. Did you mean 'toTextStreamResponse'?
```
Fix it, verify, and then give a concise explanation. @src/app/api/chat/route.ts:13-16 

---

**Cursor**

Checking AI SDK v6 stream response methods and what `DefaultChatTransport` expects.



Replacing deprecated `toDataStreamResponse` with `toUIMessageStreamResponse()` (matches `DefaultChatTransport`). Converting client `UIMessage[]` to model messages with `convertToModelMessages`.



Here’s what changed:

### Fix
- Use **`result.toUIMessageStreamResponse()`** instead of `toDataStreamResponse()`.
- **`DefaultChatTransport`** expects the **UI message stream** format from the server, which `toUIMessageStreamResponse()` produces.
- **`convertToModelMessages()`** turns the JSON **`UIMessage[]`** from the client into **`ModelMessage[]`** for `streamText` (roles + `parts` → model format).

### Verification
- `read_lints` on `route.ts`: **clean**
- `eslint src/app/api/chat/route.ts`: **exit 0**

### Why
In **AI SDK v6**, `StreamTextResult` no longer has `toDataStreamResponse`. That older helper belonged to the previous data-stream protocol. For `useChat` + **`DefaultChatTransport`**, the supported helper is **`toUIMessageStreamResponse()`**, which streams the UI message chunks the client reads.  
`toTextStreamResponse()` is only for a simple **text** stream (and would need **`TextStreamChatTransport`** on the client, not the default).

