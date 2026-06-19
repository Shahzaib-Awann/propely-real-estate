"use client";

// @/components/pages/chat/conversation-messages.tsx

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Ban, Check, CheckCheck, Send } from "lucide-react";
import { sendMessage } from "@/lib/actions/chat.action";
import { getDateLabel } from "@/lib/utils/general";
import { format } from "date-fns";


interface Message {
  id: string;
  senderId: number;
  message: string;
  seenAt: string | null;
  isDeleted: boolean;
  createdAt: string;
}

interface Props {
  messages: Message[];
  conversationId: string;
  userId: number;
}

export default function ConversationMessages({
  messages,
  conversationId,
  userId,
}: Props) {
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);


  async function handleSend() {
    if (!text.trim()) return;

    const message = text;

    setText("");

    startTransition(async () => {
      await sendMessage({
        conversationId,
        senderId: userId,
        message,
      });

      router.refresh();
    });
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
  const isOwnMessage = message.senderId === Number(userId);
  const isSeen = !!message.seenAt;
  const isDeleted = message.isDeleted;

  const currentDateLabel = getDateLabel(message.createdAt);

  const previousDateLabel =
    index > 0
      ? getDateLabel(messages[index - 1].createdAt)
      : null;

  const showDateSeparator =
    currentDateLabel !== previousDateLabel;

  return (
    <div key={message.id}>
      {showDateSeparator && (
        <div className="flex justify-center my-4">
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            {currentDateLabel}
          </span>
        </div>
      )}

      <div
        className={`flex ${
          isOwnMessage
            ? "justify-end"
            : "justify-start"
        }`}
      >
        <div
          className={`max-w-[70%] rounded-xl px-4 py-2 ${
            isOwnMessage
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          {isDeleted ? (
            <div className="flex items-center gap-2 italic opacity-70">
              <Ban size={14} />
              <span>This message was deleted</span>
            </div>
          ) : (
            <p>{message.message}</p>
          )}

          <div className="mt-1 flex items-center justify-end gap-1 text-xs opacity-70">
            <span>
              {format(
                new Date(message.createdAt),
                "hh:mm a"
              )}
            </span>

            {isOwnMessage && !isDeleted && (
              <span className="ml-1">
                {isSeen ? (
                  <CheckCheck size={14} />
                ) : (
                  <Check size={12} />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
})}
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 rounded-md border px-3 py-2"
          />

          <button
            onClick={handleSend}
            disabled={isPending}
            className="rounded-md border px-4"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
}