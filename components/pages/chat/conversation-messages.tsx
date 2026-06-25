"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ArrowLeft, Ban, Check, CheckCheck, CheckSquare, Ellipsis, Menu, Send, Square, Trash2 } from "lucide-react";

import { deleteMessages, sendMessage } from "@/lib/actions/chat.action";
import { formatDateFns } from "@/lib/utils/general";
import { socket } from "@/lib/socket/client";
import { SOCKET_EVENTS } from "@/lib/socket/socket-events";
import { ConversationHeader, RealtimeMessage } from "@/types/propely.chat";
import { useChatStore } from "@/lib/store/use-chat-store";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePresenceStore } from "@/lib/store/use-presence-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Props {
  messages: RealtimeMessage[];
  conversationId: string;
  userId: number;
  unReadMessages: number;

  conversation : ConversationHeader | null
}

export default function ConversationMessages({
  messages,
  conversationId,
  userId,
  unReadMessages : unreadCount,
  conversation
}: Props) {
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [chatMessages, setChatMessages] = useState<RealtimeMessage[]>(messages);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);

  // New States for Selection Mode
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);

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

  // New real-time deletion listener
    const handleMessagesDeleted = ({ messageIds }: { messageIds: string[] }) => {
      setChatMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg.id)
            ? { ...msg, isDeleted: true, deletedAt: new Date().toISOString() }
            : msg
        )
      );
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
    socket.on(SOCKET_EVENTS.MESSAGES_DELETED, handleMessagesDeleted);
    socket.on(SOCKET_EVENTS.MESSAGE_SEEN, handleMessageSeen);
    socket.on(SOCKET_EVENTS.TYPING_START, handleTypingStart);
  socket.on(SOCKET_EVENTS.TYPING_STOP, handleTypingStop);

    return () => {
      socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
      socket.off(SOCKET_EVENTS.MESSAGES_DELETED, handleMessagesDeleted);
      socket.off(SOCKET_EVENTS.MESSAGE_SEEN, handleMessageSeen);
      socket.off(SOCKET_EVENTS.TYPING_START, handleTypingStart);
    socket.off(SOCKET_EVENTS.TYPING_STOP, handleTypingStop);
    };
  }, [conversationId, userId]);

  // Handle Select Toggling
  const toggleSelectMessage = (id: string, isOwnMessage: boolean, isDeleted: boolean) => {
    if (!isSelectionMode) return;
    if (!isOwnMessage || isDeleted) return; // Can't delete other people's messages or already deleted ones

    setSelectedMessageIds((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  };

  // Execute Deletion Request
  const handleDeleteSelected = () => {
    if (!selectedMessageIds.length) return;

    startTransition(async () => {
      const res = await deleteMessages({
        messageIds: selectedMessageIds,
        userId,
        conversationId,
      });

      if (res.success && res.messageIds) {
        socket.emit(SOCKET_EVENTS.MESSAGES_DELETED, {
          conversationId,
          messageIds: res.messageIds,
        });
        // Reset state values cleanly
        setSelectedMessageIds([]);
        setIsSelectionMode(false);
      }
    });
  };

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

  const isOnline = usePresenceStore((state) =>
    state.isUserOnline(String(conversation?.otherUser.id))
  );

  return (
  <>
   <header className="border-b p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/chat" className="lg:hidden">
          <ArrowLeft size={20} />
        </Link>

        <div className="relative shrink-0">
        <Avatar className="h-12 w-12 shadow-sm">
          <AvatarImage
            src={
              conversation?.otherUser.avatar ??
              undefined
            }
            alt={conversation?.otherUser.name}
            className="group-hover:scale-110 transition-all duration-300"
          />
          <AvatarFallback>
            {conversation?.otherUser.name
              ?.slice(0, 2)
              .toUpperCase() ?? "GU"}
          </AvatarFallback>
        </Avatar>

        {isOnline && (
          <span className="absolute bottom-0 size-4 transition-all duration-500 right-0 rounded-full border-2 border-background bg-green-500" />
        )}
      </div>

        <div>
          <h2 className="font-semibold">
            {conversation?.otherUser.name}
          </h2>

          <p className="text-sm text-muted-foreground">
            {conversation?.property.title}
          </p>
        </div>
        </div>

        <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button><Ellipsis className="rotate-90" /></button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuLabel>Menu</DropdownMenuLabel>
      <DropdownMenuItem>
        <button
            onClick={() => setIsSelectionMode(true)}
            className="text-xs font-medium text-primary underline underline-offset-4"
          >
            Delete Messages
          </button></DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
      </header>

    {/* Selection Control Panel Toolbar */}
      {isSelectionMode && (
    <div className="bg-muted/40 px-4 py-2 border-b flex justify-between items-center text-sm h-12">
        <>
          <span className="font-medium text-muted-foreground">
            {selectedMessageIds.length} message(s) selected
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsSelectionMode(false);
                setSelectedMessageIds([]);
              }}
              className="px-3 py-1 text-xs border rounded bg-background hover:bg-muted"
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteSelected}
              disabled={!selectedMessageIds.length || isPending}
              className="px-3 py-1 text-xs border rounded bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-1 disabled:opacity-50"
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        </>
    </div>
      )}

    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {chatMessages.map((message, index) => {
        const isOwnMessage = message.senderId === userId;
        const isSeen = Boolean(message.seenAt);
        const isDeleted = message.isDeleted;
        const isSelected = selectedMessageIds.includes(message.id);

        const currentDateLabel = formatDateFns(
          message.createdAt,
          "smart"
        );

        const previousDateLabel =
          index > 0
            ? formatDateFns(
                chatMessages[index - 1].createdAt,
                "smart"
              )
            : null;

        const showDateSeparator =
          currentDateLabel !== previousDateLabel;

        return (
          <div key={message.id}>
            {/* Date separator */}
            {showDateSeparator && (
              <div className="flex justify-center my-4">
                <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {currentDateLabel}
                </span>
              </div>
            )}

            {/* Message row */}
            <div
              onClick={() =>
                toggleSelectMessage(
                  message.id,
                  isOwnMessage,
                  isDeleted
                )
              }
              className={`flex items-center gap-3 group select-none ${
                isOwnMessage
                  ? "justify-end"
                  : "justify-start"
              } ${
                isSelectionMode &&
                isOwnMessage &&
                !isDeleted
                  ? "cursor-pointer hover:opacity-80"
                  : ""
              }`}
            >
              {/* Checkbox */}
              {isSelectionMode &&
                isOwnMessage &&
                !isDeleted && (
                  <div
                    className={
                      isOwnMessage
                        ? "order-first"
                        : ""
                    }
                  >
                    {isSelected ? (
                      <CheckSquare
                        size={16}
                        className="text-primary"
                      />
                    ) : (
                      <Square
                        size={16}
                        className="text-muted-foreground"
                      />
                    )}
                  </div>
                )}

              {/* Bubble */}
              <div
                className={`max-w-[70%] rounded-xl px-4 py-2 relative ${
                  isOwnMessage
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                } ${
                  isSelected
                    ? "ring-2 ring-primary ring-offset-2"
                    : ""
                }`}
              >
                {isDeleted ? (
                  <div className="flex items-center gap-2 italic opacity-70 text-xs py-1">
                    <Ban size={14} />
                    <span>
                      This message was deleted
                    </span>
                  </div>
                ) : (
                  <p className="break-words">
                    {message.message}
                  </p>
                )}

                {!isDeleted && (
                  <div className="mt-1 flex items-center justify-end gap-1 text-xs opacity-70">
                    <span>
                      {formatDateFns(
                        message.createdAt,
                        "time"
                      )}
                    </span>

                    {isOwnMessage && (
                      <>
                        {isSeen ? (
                          <CheckCheck size={14} />
                        ) : (
                          <Check size={12} />
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing indicator */}
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

    {/* Input */}
    <div className="border-t p-4">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={handleInputChange}
          disabled={isSelectionMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isPending) {
              if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                socket.emit(SOCKET_EVENTS.TYPING_STOP, {
                  conversationId,
                  userId,
                });
                typingTimeoutRef.current = null;
              }
              handleSend();
            }
          }}
          placeholder={
            isSelectionMode
              ? "Exit selection mode to type..."
              : "Type a message..."
          }
          className="flex-1 rounded-md border px-3 py-2 disabled:bg-muted/50"
        />

        <button
          onClick={handleSend}
          disabled={
            isPending ||
            !text.trim() ||
            isSelectionMode
          }
          className="rounded-md border px-4 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  </>
);
}
