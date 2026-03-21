"use client"

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
import { DefaultChatTransport } from "ai"
import { MessageSquareIcon } from "lucide-react"
import Image from "next/image"

const transport = new DefaultChatTransport({ api: "/api/chat" })

export const Chat = () => {
  const { messages, sendMessage, status, stop } = useChat({ transport })

  const isGenerating = status === "submitted" || status === "streaming"
  const lastIndex = messages.length - 1

  const handleSubmit = ({ text }: { text: string }) => {
    if (!text.trim() || isGenerating) return
    void sendMessage({ text })
  }

  return (
    <div className="flex h-svh flex-col">
      <Conversation>
        <ConversationContent>
          {messages.length === 0 && (
            <ConversationEmptyState
              description="Send a message to start chatting"
              icon={<MessageSquareIcon className="size-8" />}
              title="How can I help you?"
            />
          )}

          {messages.map((message, index) => (
            <Message from={message.role} key={message.id}>
              <MessageContent>
                {message.parts.map((part, partIndex) => {
                  if (part.type === "text") {
                    return (
                      <MessageResponse
                        isAnimating={
                          status === "streaming" &&
                          index === lastIndex &&
                          message.role === "assistant"
                        }
                        key={partIndex}
                      >
                        {part.text}
                      </MessageResponse>
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
                            className="relative mt-2 max-h-96 w-full max-w-2xl"
                            key={partIndex}
                          >
                            <Image
                              alt="Generated"
                              className="rounded-lg border object-contain"
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
                        <p className="text-sm text-destructive" key={partIndex}>
                          {part.errorText}
                        </p>
                      )
                    }

                    return (
                      <div
                        className="flex items-center gap-2 text-sm text-muted-foreground"
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

      <div className="p-4">
        <PromptInput onSubmit={handleSubmit}>
          <PromptInputTextarea placeholder="Ask me anything…" />
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit onStop={stop} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
}
