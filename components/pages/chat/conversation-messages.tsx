"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Ban, Check, CheckCheck, Send } from "lucide-react";

import { sendMessage } from "@/lib/actions/chat.action";
import { formatDateFns } from "@/lib/utils/general";
import { socket } from "@/lib/socket/client";
import { SOCKET_EVENTS } from "@/lib/socket/socket-events";
import { RealtimeMessage } from "@/types/propely.chat";
import { useChatStore } from "@/lib/store/use-chat-store";

interface Props {
  messages: RealtimeMessage[];
  conversationId: string;
  userId: number;
  unReadMessages: number;
}

export default function ConversationMessages({
  messages,
  conversationId,
  userId,
  unReadMessages : unreadCount,
}: Props) {
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [chatMessages, setChatMessages] = useState<RealtimeMessage[]>(messages);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (unreadCount > 0) {
      // Deduct this specific conversation's count from the global badge total
      useChatStore.getState().reduceUnreadCount(unreadCount);
    }
  }, [unreadCount]);

  // Consolidated Real-time Socket Event Listeners
  useEffect(() => {
    if (!conversationId) return;

    // Emit initial read status for the conversation
    socket.emit(SOCKET_EVENTS.MESSAGE_SEEN, { conversationId, viewerId: userId });

    const handleNewMessage = (message: RealtimeMessage) => {
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });

      // If someone else sent it, automatically mark it seen locally and notify server
      if (message.senderId !== userId) {
        socket.emit(SOCKET_EVENTS.MESSAGE_SEEN, { conversationId, viewerId: userId });
      }
    };

    const handleMessageSeen = ({
    conversationId: id,
    viewerId,
  }: {
    conversationId: string;
    viewerId: number;
  }) => {
    // ⚠️ Only update UI if OTHER user is viewing the chat
    if (Number(viewerId) !== Number(userId)) {
      if (id !== conversationId) return;

      setChatMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          seenAt:
            msg.seenAt ?? new Date().toISOString(),
        }))
      );
    }
  };

  const handleTypingStart = (payload: { conversationId: string; userId: number }) => {
    if (payload.conversationId === conversationId && Number(payload.userId) !== Number(userId)) {
      setIsOtherUserTyping(true);
    }
  };

  const handleTypingStop = (payload: { conversationId: string; userId: number }) => {
    if (payload.conversationId === conversationId && Number(payload.userId) !== Number(userId)) {
      setIsOtherUserTyping(false);
    }
  };

    socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
    socket.on(SOCKET_EVENTS.MESSAGE_SEEN, handleMessageSeen);
    socket.on(SOCKET_EVENTS.TYPING_START, handleTypingStart);
  socket.on(SOCKET_EVENTS.TYPING_STOP, handleTypingStop);

    return () => {
      socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
      socket.off(SOCKET_EVENTS.MESSAGE_SEEN, handleMessageSeen);
      socket.off(SOCKET_EVENTS.TYPING_START, handleTypingStart);
    socket.off(SOCKET_EVENTS.TYPING_STOP, handleTypingStop);
    };
  }, [conversationId, userId]);

  // Create a handler function for the input field's onChange event
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setText(e.target.value);

  // 1. If this is the first keystroke, notify the server instantly
  if (!typingTimeoutRef.current) {
    socket.emit(SOCKET_EVENTS.TYPING_START, { conversationId, userId });
  }

  // 2. Clear any existing timeout countdown
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }

  // 3. Set a new timeout to declare the user has stopped typing after 2 seconds
  typingTimeoutRef.current = setTimeout(() => {
    socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId, userId });
    typingTimeoutRef.current = null;
  }, 2000);
};

  async function handleSend() {
    if (!text.trim()) return;
    const messageText = text.trim();
    setText("");

    startTransition(async () => {
      const savedMessage = await sendMessage({
        conversationId,
        senderId: userId,
        message: messageText,
      });

      if (savedMessage) {
        socket.emit(SOCKET_EVENTS.SEND_MESSAGE, savedMessage);
      }
    });
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message, index) => {
          const isOwnMessage = message.senderId === userId;
          const isSeen = Boolean(message.seenAt);
          const isDeleted = message.isDeleted;

          const currentDateLabel = formatDateFns(message.createdAt, "smart");
          const previousDateLabel = index > 0 ? formatDateFns(chatMessages[index - 1].createdAt, "smart") : null;

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
                    <span>{formatDateFns(message.createdAt, "time")}</span>
                    {isOwnMessage && !isDeleted && (
                      <>{isSeen ? <CheckCheck size={14} /> : <Check size={12} />}</>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {isOtherUserTyping && (
        <div className="flex justify-start items-center gap-2 text-sm text-muted-foreground transition-all duration-300 animate-pulse">
          <div className="bg-muted rounded-xl px-4 py-4 flex items-center gap-1">
            <span className="size-1.5 bg-muted-foreground rounded-full animate-bounce delay-100" />
            <span className="size-1.5 bg-muted-foreground rounded-full animate-bounce delay-200" />
            <span className="size-1.5 bg-muted-foreground rounded-full animate-bounce delay-300" />
          </div>
        </div>
      )}

        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={handleInputChange}
            onKeyDown={(e) => {
            if (e.key === "Enter" && !isPending) {
              if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId, userId });
                typingTimeoutRef.current = null;
              }
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
