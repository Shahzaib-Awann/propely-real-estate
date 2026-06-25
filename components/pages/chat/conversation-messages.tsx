"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  ArrowLeft,
  Ban,
  Check,
  CheckCheck,
  CheckSquare,
  Ellipsis,
  Send,
  Square,
  Trash2,
} from "lucide-react";

import { deleteMessages, sendMessage } from "@/lib/actions/chat.action";
import { cn, formatDateFns } from "@/lib/utils/general";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  messages: RealtimeMessage[];
  conversationId: string;
  userId: number;
  unReadMessages: number;

  conversation: ConversationHeader | null;
}

export default function ConversationMessages({
  messages,
  conversationId,
  userId,
  unReadMessages: unreadCount,
  conversation,
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
    socket.emit(SOCKET_EVENTS.MESSAGE_SEEN, {
      conversationId,
      viewerId: userId,
    });

    const handleNewMessage = (message: RealtimeMessage) => {
      setChatMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });

      // If someone else sent it, automatically mark it seen locally and notify server
      if (message.senderId !== userId) {
        socket.emit(SOCKET_EVENTS.MESSAGE_SEEN, {
          conversationId,
          viewerId: userId,
        });
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
            seenAt: msg.seenAt ?? new Date().toISOString(),
          })),
        );
      }
    };

    // New real-time deletion listener
    const handleMessagesDeleted = ({
      messageIds,
    }: {
      messageIds: string[];
    }) => {
      setChatMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg.id)
            ? { ...msg, isDeleted: true, deletedAt: new Date().toISOString() }
            : msg,
        ),
      );
    };

    const handleTypingStart = (payload: {
      conversationId: string;
      userId: number;
    }) => {
      if (
        payload.conversationId === conversationId &&
        Number(payload.userId) !== Number(userId)
      ) {
        setIsOtherUserTyping(true);
      }
    };

    const handleTypingStop = (payload: {
      conversationId: string;
      userId: number;
    }) => {
      if (
        payload.conversationId === conversationId &&
        Number(payload.userId) !== Number(userId)
      ) {
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
  const toggleSelectMessage = (
    id: string,
    isOwnMessage: boolean,
    isDeleted: boolean,
  ) => {
    if (!isSelectionMode) return;
    if (!isOwnMessage || isDeleted) return; // Can't delete other people's messages or already deleted ones

    setSelectedMessageIds((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id],
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
    state.isUserOnline(String(conversation?.otherUser.id)),
  );

  return (
    <>
      {/* 1. Chat Header Layer */}
      <header className="border-b border-border p-4 flex items-center justify-between gap-4 bg-background z-10">
        <div className="flex items-center gap-3">
          <Link href="/chat" className="lg:hidden text-foreground hover:text-primary transition-colors duration-200">
            <ArrowLeft size={20} />
          </Link>

          {/* User Status Avatar Wrapper */}
          <div className="relative shrink-0 group">
            <Avatar className="h-11 w-11 shadow-sm border border-border overflow-hidden">
              <AvatarImage
                src={conversation?.otherUser.avatar ?? undefined}
                alt={conversation?.otherUser.name}
                className="object-cover group-hover:scale-110 transition-all duration-300"
              />
              <AvatarFallback className="bg-muted font-lato text-sm font-semibold text-foreground/70">
                {conversation?.otherUser.name?.slice(0, 2).toUpperCase() ?? "GU"}
              </AvatarFallback>
            </Avatar>
            {isOnline && (
              <span className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-background bg-green-500 shadow-sm animate-pulse" />
            )}
          </div>

          <div>
            <h2 className="font-lato font-bold text-base text-foreground tracking-tight leading-tight">
              {conversation?.otherUser.name}
            </h2>
            <p className="text-xs font-lato text-foreground/60 mt-0.5 max-w-[200px] sm:max-w-xs truncate">
              Regarding: <span className="font-medium text-foreground/80">{conversation?.property.title}</span>
            </p>
          </div>
        </div>

        {/* Header Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="rounded-radius bg-transparent text-foreground focus:outline-none focus:ring-0 hover:bg-card-foreground hover:text-primary-foreground/75 transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              <Ellipsis className="rotate-90 size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-background border border-border text-foreground rounded-xs p-1 shadow-md animate-in fade-in-50 duration-200"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-lato font-medium text-foreground/50 tracking-wide uppercase">
                Conversation Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                asChild
                className="w-full px-2 py-2 text-sm font-lato rounded-xs cursor-pointer text-foreground focus:bg-primary focus:text-primary-foreground transition-colors duration-150"
              >
                <button
                  onClick={() => setIsSelectionMode(true)}
                  className="w-full text-left flex items-center justify-between"
                >
                  <span>Select Messages</span>
                  <span className="text-[10px] opacity-60 uppercase font-bold tracking-wider">Edit</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* 2. Selection Control Panel Toolbar */}
      {isSelectionMode && (
        <div className="bg-card-foreground/5 dark:bg-card-foreground/20 px-4 py-2 border-b border-border flex justify-between items-center h-14 animate-in slide-in-from-top-2 duration-200">
          <span className="font-lato font-medium text-sm text-foreground/70">
            {selectedMessageIds.length} message{selectedMessageIds.length !== 1 ? "s" : ""} selected
          </span>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                setIsSelectionMode(false);
                setSelectedMessageIds([]);
              }}
              variant="outline"
              className="h-9 px-4 text-xs font-lato font-medium rounded-xs border-border hover:bg-background transition-all duration-200 hover:scale-[1.02]"
            >
              Cancel
            </Button>

            <Button
              onClick={handleDeleteSelected}
              disabled={!selectedMessageIds.length || isPending}
              className={cn(
                "h-9 px-4 text-xs font-lato font-medium rounded-xs flex items-center gap-1.5 transition-all duration-200 hover:scale-[1.02]",
                selectedMessageIds.length > 0
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-red-200 dark:bg-red-950/40 text-red-400 dark:text-red-900 cursor-not-allowed"
              )}
            >
              <Trash2 size={13} />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* 3. Messages Window Viewport Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
        {chatMessages.map((message, index) => {
          const isOwnMessage = message.senderId === userId;
          const isSeen = Boolean(message.seenAt);
          const isDeleted = message.isDeleted;
          const isSelected = selectedMessageIds.includes(message.id);

          const currentDateLabel = formatDateFns(message.createdAt, "smart");
          const previousDateLabel =
            index > 0 ? formatDateFns(chatMessages[index - 1].createdAt, "smart") : null;
          const showDateSeparator = currentDateLabel !== previousDateLabel;

          return (
            <div key={message.id} className="w-full flex flex-col">
              {/* Smart Date Separator Bubble */}
              {showDateSeparator && (
                <div className="flex justify-center my-6">
                  <span className="rounded-full bg-card-foreground/5 dark:bg-card-foreground/10 px-4 py-1 text-[11px] font-lato font-semibold text-foreground/50 tracking-wider uppercase">
                    {currentDateLabel}
                  </span>
                </div>
              )}

              {/* Message Bubble Row Container Layout */}
              <div
                onClick={() => toggleSelectMessage(message.id, isOwnMessage, isDeleted)}
                className={cn(
                  "flex items-end gap-3 group select-none py-0.5 max-w-full transition-all duration-150",
                  isOwnMessage ? "justify-end" : "justify-start",
                  isSelectionMode && isOwnMessage && !isDeleted ? "cursor-pointer hover:opacity-90" : ""
                )}
              >
                {/* Selection Mode Checkbox Indicator */}
                {isSelectionMode && isOwnMessage && !isDeleted && (
                  <div className={cn("pb-2 transition-transform duration-200 hover:scale-110", isOwnMessage ? "order-first mr-1" : "ml-1")}>
                    {isSelected ? (
                      <CheckSquare size={18} className="text-primary fill-primary/10" />
                    ) : (
                      <Square size={18} className="text-foreground/30 hover:text-foreground/50" />
                    )}
                  </div>
                )}

                {/* Structured Professional Message Text Box */}
                <div
                  className={cn(
                    "max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-xs relative transition-all duration-200",
                    isOwnMessage
                      ? "bg-primary text-primary-foreground rounded-br-xs"
                      : "bg-card-foreground/5 dark:bg-card-foreground/10 text-foreground rounded-bl-xs",
                    isSelected ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-background scale-[0.99]" : ""
                  )}
                >
                  {isDeleted ? (
                    <div className="flex items-center gap-2 italic opacity-60 text-xs py-0.5">
                      <Ban size={14} className="shrink-0" />
                      <span className="font-lato text-sm">This message was removed</span>
                    </div>
                  ) : (
                    <p className="break-words text-sm leading-relaxed font-sans whitespace-pre-wrap selection:bg-background/30">
                      {message.message}
                    </p>
                  )}

                  {/* Status Indicator Timestamp Metadata Block */}
                  {!isDeleted && (
                    <div
                      className={cn(
                        "mt-1.5 flex items-center justify-end gap-1 text-[11px] font-lato tracking-wide uppercase opacity-55 select-none",
                        isOwnMessage ? "text-primary-foreground" : "text-foreground/80"
                      )}
                    >
                      <span>{formatDateFns(message.createdAt, "time")}</span>
                      {isOwnMessage && (
                        <span className="shrink-0 ml-0.5">
                          {isSeen ? (
                            <CheckCheck size={13} className="text-primary-foreground" />
                          ) : (
                            <Check size={12} className="text-primary-foreground/70" />
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Clean Typist Wave Indicator Animation */}
        {isOtherUserTyping && (
          <div className="flex justify-start items-center gap-2 py-1 animate-in fade-in-50 duration-300">
            <div className="bg-card-foreground/5 dark:bg-card-foreground/10 rounded-2xl rounded-bl-xs px-4 py-3.5 flex items-center gap-1.5">
              <span className="size-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="size-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="size-1.5 bg-foreground/40 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Action Text Input Deck - Strip Layout Paradigm */}
      <div className="border-t border-border p-4 bg-background">
        <div className="border border-border rounded-md px-2 py-1.5 flex items-center gap-2 bg-background focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition-all duration-200">
          <Input
            value={text}
            onChange={handleInputChange}
            disabled={isSelectionMode}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isPending && text.trim()) {
                if (typingTimeoutRef.current) {
                  clearTimeout(typingTimeoutRef.current);
                  socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId, userId });
                  typingTimeoutRef.current = null;
                }
                handleSend();
              }
            }}
            variant="unstyled"
            placeholder={isSelectionMode ? "Exit message selection mode to chat..." : "Write a professional message..."}
            className="flex-1 h-10 px-2 bg-transparent text-foreground placeholder:text-foreground/40 text-sm focus-visible:ring-0 disabled:cursor-not-allowed"
          />

          <Button
            size="icon"
            onClick={handleSend}
            disabled={isPending || !text.trim() || isSelectionMode}
            className="size-10 rounded-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105 shrink-0 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </>
  );
}
