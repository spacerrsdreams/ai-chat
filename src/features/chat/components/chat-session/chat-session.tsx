import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input"
import { Spinner } from "@/components/ui/spinner"
import { useChat } from "@ai-sdk/react"
import { useMutateCreateChat } from "@/features/chat/hooks/use-mutate-create-chat"
import { createStableChatTransport } from "@/features/chat/utils/stable-chat-transport"
import { isImageGenerationInProgress } from "@/features/chat/utils/is-image-generation-in-progress"
import { cn } from "@/lib/utils"
import type { UIMessage } from "ai"
import { MessageSquareIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

type ChatSessionProps = {
  sessionClientId: string
  initialMessages: UIMessage[]
  initialDbChatId: string | null
  onChatCreated: (id: string) => void
  onConversationUpdated: () => void
}

export const ChatSession = ({
  sessionClientId,
  initialMessages,
  initialDbChatId,
  onChatCreated,
  onConversationUpdated,
}: ChatSessionProps) => {
  const [transportApi] = useState(() => createStableChatTransport())
  const createChatMutation = useMutateCreateChat()

  useEffect(() => {
    transportApi.setChatId(initialDbChatId)
  }, [initialDbChatId, transportApi])

  const { messages, sendMessage, status, stop } = useChat({
    id: sessionClientId,
    messages: initialMessages,
    transport: transportApi.transport,
    onFinish: () => {
      onConversationUpdated()
    },
  })

  const isGenerating = status === "submitted" || status === "streaming"
  const isImageGenerating = useMemo(
    () => isImageGenerationInProgress(messages),
    [messages]
  )
  const lastIndex = messages.length - 1

  const handleSubmit = async ({ text }: { text: string }) => {
    if (!text.trim() || isGenerating || isImageGenerating) {
      return
    }
    if (!transportApi.getChatId()) {
      try {
        const { id } = await createChatMutation.mutateAsync()
        transportApi.setChatId(id)
        onChatCreated(id)
      } catch {
        return
      }
    }
    void sendMessage({ text })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation className="min-h-0 flex-1">
        <ConversationContent>
          {messages.length === 0 && (
            <ConversationEmptyState>
              <div className="text-muted-foreground">
                <MessageSquareIcon className="size-8" />
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">How can I help you?</h3>
                <p className="max-w-md text-sm text-muted-foreground">
                  This chat answers with{" "}
                  <span className="text-foreground/90">text</span> and can{" "}
                  <span className="text-foreground/90">generate images</span>{" "}
                  when you describe what you want to see—just ask in natural
                  language.
                </p>
                <p className="max-w-md text-xs text-muted-foreground">
                  For queued jobs that finish in the background, open{" "}
                  <Link
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                    href="/toolkit"
                  >
                    Images
                  </Link>{" "}
                  in the sidebar.
                </p>
              </div>
            </ConversationEmptyState>
          )}

          {messages.map((message, index) => (
            <Message
              className={cn(
                message.role === "user" &&
                  "w-fit max-w-[min(100%,28rem)] justify-end"
              )}
              from={message.role}
              key={message.id}
            >
              <MessageContent
                className={cn(
                  message.role === "user"
                    ? "min-w-0 flex-col gap-3"
                    : "flex w-full min-w-0 flex-col gap-3"
                )}
              >
                {message.parts.map((part, partIndex) => {
                  if (part.type === "text") {
                    const isUser = message.role === "user"
                    return (
                      <div
                        className={cn(
                          "block min-w-0 shrink-0",
                          isUser ? "max-w-full" : "w-full min-w-0"
                        )}
                        key={partIndex}
                      >
                        <MessageResponse
                          className={cn(
                            "block min-w-0",
                            isUser ? "max-w-full" : "w-full"
                          )}
                          isAnimating={
                            status === "streaming" &&
                            index === lastIndex &&
                            message.role === "assistant"
                          }
                        >
                          {part.text}
                        </MessageResponse>
                      </div>
                    )
                  }

                  if (part.type === "tool-generateImage") {
                    if (part.state === "output-available") {
                      const out = part.output
                      if (
                        typeof out === "object" &&
                        out !== null &&
                        "url" in out &&
                        typeof out.url === "string"
                      ) {
                        return (
                          <div
                            className="relative mt-2 block w-full max-w-2xl shrink-0 overflow-hidden rounded-lg"
                            key={partIndex}
                          >
                            <Image
                              alt="Generated"
                              className="h-auto max-h-[min(28rem,58vh)] w-full object-contain"
                              height={1024}
                              src={out.url}
                              unoptimized
                              width={1024}
                            />
                          </div>
                        )
                      }
                    }

                    if (part.state === "output-error") {
                      return (
                        <p
                          className="block w-full shrink-0 text-sm text-destructive"
                          key={partIndex}
                        >
                          {part.errorText}
                        </p>
                      )
                    }

                    return (
                      <div
                        className="flex w-full shrink-0 items-center gap-2 text-sm text-muted-foreground"
                        key={partIndex}
                      >
                        <Spinner className="size-4" />
                        Generating image…
                      </div>
                    )
                  }

                  return null
                })}
              </MessageContent>
            </Message>
          ))}

          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <Spinner className="size-4" />
              </MessageContent>
            </Message>
          )}
        </ConversationContent>

        <ConversationScrollButton />
      </Conversation>

      <div className="shrink-0 bg-background p-4 pt-3">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea
            disabled={isImageGenerating}
            placeholder="Ask me anything…"
          />
          <PromptInputFooter>
            <PromptInputTools
              className={
                isImageGenerating ? "pointer-events-none opacity-40" : undefined
              }
            />
            <PromptInputSubmit onStop={stop} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
}
