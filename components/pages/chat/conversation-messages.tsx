"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Ban, Check, CheckCheck, Send } from "lucide-react";

import { sendMessage } from "@/lib/actions/chat.action";
import { formatDateFns } from "@/lib/utils/general";
import { socket } from "@/lib/socket";
import { SOCKET_EVENTS } from "@/lib/socket-events";
import { RealtimeMessage } from "@/types/propely.chat";


interface Props {
  messages: RealtimeMessage[];
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

  // initialize ONCE
  const [chatMessages, setChatMessages] = useState<RealtimeMessage[]>(() => messages);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatMessages]);


  useEffect(() => {
  const handleNewMessage = (
    message: RealtimeMessage
  ) => {

    setChatMessages((prev) => {

      const exists = prev.some(
        (m) => m.id === message.id
      );

      if (exists) {
        return prev;
      }

      return [...prev, message];
    });

    if (message.senderId !== userId) {
      socket.emit(SOCKET_EVENTS.MESSAGE_SEEN, {
        conversationId,
      });
    }
  };


  socket.on(
    SOCKET_EVENTS.NEW_MESSAGE,
    handleNewMessage
  );

  return () => {
    socket.off(
      SOCKET_EVENTS.NEW_MESSAGE,
      handleNewMessage
    );
  };
}, [conversationId, userId]);

useEffect(() => {
  const handleMessageSeen = ({
    conversationId: id,
  }: {
    conversationId: string;
  }) => {
    if (id !== conversationId) return;

    setChatMessages((prev) =>
      prev.map((message) => ({
        ...message,
        seenAt:
          message.seenAt ??
          new Date().toISOString(),
      }))
    );
  };

  socket.on(
    SOCKET_EVENTS.MESSAGE_SEEN,
    handleMessageSeen
  );

  return () => {
    socket.off(
      SOCKET_EVENTS.MESSAGE_SEEN,
      handleMessageSeen
    );
  };
}, [conversationId]);

  async function handleSend() {
  if (!text.trim()) return;

  const messageText = text.trim();

  setText("");

  startTransition(async () => {
    const savedMessage =
      await sendMessage({
        conversationId,
        senderId: userId,
        message: messageText,
      });

    if (!savedMessage) return;

    socket.emit(
      SOCKET_EVENTS.NEW_MESSAGE,
      savedMessage
    );

  });
}

  return (
    <>
      {" "}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message, index) => {
          const isOwnMessage = message.senderId === userId;

          const isSeen = Boolean(message.seenAt);

          const isDeleted = message.isDeleted;

          const currentDateLabel = formatDateFns(message.createdAt, "smart");

          const previousDateLabel =
            index > 0 ? formatDateFns(chatMessages[index - 1].createdAt, "smart") : null;

          const showDateSeparator = currentDateLabel !== previousDateLabel;

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
                  isOwnMessage ? "justify-end" : "justify-start"
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
                      {formatDateFns(message.createdAt, "time")}
                    </span>

                    {isOwnMessage && !isDeleted && (
                      <>
                        {isSeen ? (
                          <CheckCheck size={14} />
                        ) : (
                          <Check size={12} />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isPending) {
                handleSend();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 rounded-md border px-3 py-2"
          />

          <button
            onClick={handleSend}
            disabled={isPending || !text.trim()}
            className="rounded-md border px-4"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
}
