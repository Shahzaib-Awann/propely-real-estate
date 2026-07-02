"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Ban, Check, CheckCheck, Trash2 } from "lucide-react";
import { cn, formatDateFns } from "@/lib/utils/general";
import { socket } from "@/lib/socket/client";
import { SOCKET_EVENTS } from "@/lib/socket/socket-events";
import { ConversationHeader, RealtimeMessage } from "@/types/propely.chat";
import { useChatStore } from "@/lib/store/use-chat-store";
import { Button } from "@/components/ui/button";

import ChatHeader from "./chat-header";
import ChatInput from "./chat-input";
import {
  deleteMessages,
  getConversationMessages,
  sendMessage,
} from "@/lib/actions/chat.action";

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

  // Handles async UI transitions
  const [isPending, startTransition] = useTransition();

  // Local states
  const [chatMessages, setChatMessages] = useState<RealtimeMessage[]>(messages);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);

  // Pagination & Layout Sync States
  const [hasMore, setHasMore] = useState(messages.length === 30);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);

  // DOM Layout Element Viewport Anchors
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);

  // Safety timeout reference for typing indicator cleanup
  const otherUserTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Auto-scroll to latest message when new messages arrive or loading completes
   */
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    if (isInitialRender.current && chatMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      isInitialRender.current = false;
    } else if (!isLoadingMore) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isLoadingMore]);

  // Infinite Scroll Hook Logic Execution Matrix
  useEffect(() => {
    if (!hasMore || isLoadingMore || !conversationId) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          setIsLoadingMore(true);

          const container = scrollContainerRef.current;
          const previousScrollHeight = container ? container.scrollHeight : 0;
          const previousScrollTop = container ? container.scrollTop : 0;
          const cursorTimestamp = chatMessages[0]?.createdAt ?? null;

          try {
            const olderMessages = await getConversationMessages({
              conversationId,
              cursor: cursorTimestamp,
              limit: 30,
            });

            if (olderMessages.length < 30) setHasMore(false);

            if (olderMessages.length > 0) {
              setChatMessages((prev) => [...olderMessages, ...prev]);

              // Preserve scroll position after prepending messages
              requestAnimationFrame(() => {
                if (container) {
                  container.scrollTop =
                    container.scrollHeight -
                    previousScrollHeight +
                    previousScrollTop;
                }
              });
            }
          } catch (err) {
            console.error("Failed to load historical records:", err);
          } finally {
            setIsLoadingMore(false);
          }
        }
      },
      { root: scrollContainerRef.current, threshold: 0.1 },
    );

    const currentSentinel = topSentinelRef.current;
    if (currentSentinel) observer.observe(currentSentinel);
    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [hasMore, isLoadingMore, chatMessages, conversationId]);

  /**
   * Reduce global unread count when entering a conversation
   */
  useEffect(() => {
    if (unreadCount > 0) useChatStore.getState().reduceUnreadCount(unreadCount);
  }, [unreadCount, conversationId]);

  /**
   * Socket Event Handlers
   * Manages real-time messaging, typing, seen status, and deletions
   */
  useEffect(() => {
    if (!conversationId) return;

    // Send message seen event on mount
    socket.emit(SOCKET_EVENTS.MESSAGE_SEEN, {
      conversationId,
      viewerId: userId,
    });

    // Handle incoming new messages
    const handleNewMessage = (message: RealtimeMessage) => {
      setChatMessages((prev) =>
        prev.some((m) => m.id === message.id) ? prev : [...prev, message],
      );

      // Auto mark as seen if message is from other user
      if (message.senderId !== userId) {
        socket.emit(SOCKET_EVENTS.MESSAGE_SEEN, {
          conversationId,
          viewerId: userId,
        });
      }
    };

    // Handle seen updates
    const handleMessageSeen = ({
      conversationId: id,
      viewerId,
    }: {
      conversationId: string;
      viewerId: number;
    }) => {
      if (Number(viewerId) !== Number(userId) && id === conversationId) {
        setChatMessages((prev) =>
          prev.map((msg) => ({
            ...msg,
            seenAt: msg.seenAt ?? new Date().toISOString(),
          })),
        );
      }
    };

    // Handle message deletion
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

    // Handle typing start indicator
    const handleTypingStart = (p: {
      conversationId: string;
      userId: number;
    }) => {
      if (
        p.conversationId === conversationId &&
        Number(p.userId) !== Number(userId)
      ) {
        setIsOtherUserTyping(true);

        if (otherUserTypingTimeoutRef.current)
          clearTimeout(otherUserTypingTimeoutRef.current);

        // Safety fallback: auto-reset typing state after inactivity
        otherUserTypingTimeoutRef.current = setTimeout(() => {
          setIsOtherUserTyping(false);
        }, 4000);
      }
    };

    // Handle typing stop indicator
    const handleTypingStop = (p: {
      conversationId: string;
      userId: number;
    }) => {
      if (
        p.conversationId === conversationId &&
        Number(p.userId) !== Number(userId)
      ) {
        setIsOtherUserTyping(false);
        if (otherUserTypingTimeoutRef.current) {
          clearTimeout(otherUserTypingTimeoutRef.current);
          otherUserTypingTimeoutRef.current = null;
        }
      }
    };

    // Register socket listeners
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
    socket.on(SOCKET_EVENTS.MESSAGES_DELETED, handleMessagesDeleted);
    socket.on(SOCKET_EVENTS.MESSAGE_SEEN, handleMessageSeen);
    socket.on(SOCKET_EVENTS.TYPING_START, handleTypingStart);
    socket.on(SOCKET_EVENTS.TYPING_STOP, handleTypingStop);

    return () => {
      // Cleanup listeners on unmount or conversation change
      socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
      socket.off(SOCKET_EVENTS.MESSAGES_DELETED, handleMessagesDeleted);
      socket.off(SOCKET_EVENTS.MESSAGE_SEEN, handleMessageSeen);
      socket.off(SOCKET_EVENTS.TYPING_START, handleTypingStart);
      socket.off(SOCKET_EVENTS.TYPING_STOP, handleTypingStop);

      // Clear typing timeout safely
      if (otherUserTypingTimeoutRef.current) {
        clearTimeout(otherUserTypingTimeoutRef.current);
      }
    };
  }, [conversationId, userId]);

  /**
   * Toggle message selection for bulk actions
   */
  const toggleSelectMessage = (
    id: string,
    isOwnMessage: boolean,
    isDeleted: boolean,
  ) => {
    if (!isSelectionMode || !isOwnMessage || isDeleted) return;
    setSelectedMessageIds((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id],
    );
  };

  /**
   * Delete selected messages (bulk delete)
   */
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
        setSelectedMessageIds([]);
        setIsSelectionMode(false);
      }
    });
  };

  /**
   * Send a new message
   */
  const handleSendAction = async (messageText: string) => {
    startTransition(async () => {
      const savedMessage = await sendMessage({
        conversationId,
        senderId: userId,
        message: messageText,
      });
      if (savedMessage) socket.emit(SOCKET_EVENTS.SEND_MESSAGE, savedMessage);
    });
  };

  return (
    <>
      {/* Clean Sync to Custom Configured Header Component */}
      <ChatHeader
        conversation={conversation}
        onSelectMessagesMode={() => setIsSelectionMode(true)}
      />

      {/* Luxury Slide-Down Multi-Selection Management Panel */}
      {isSelectionMode && (
        <div className="bg-muted/60 backdrop-blur-md px-6 py-2 border-b border-border/60 flex justify-between items-center h-14 animate-in slide-in-from-top-3 duration-300 ease-out z-20 select-none">
          <div className="flex items-center gap-2">
            <span className="font-lato font-bold text-sm text-foreground tracking-tight">
              {selectedMessageIds.length} message
              {selectedMessageIds.length !== 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              onClick={() => {
                setIsSelectionMode(false);
                setSelectedMessageIds([]);
              }}
              variant="outline"
              className="h-9 px-4 text-xs font-lato font-bold border-border/80 bg-background hover:bg-muted text-foreground transition-all duration-200 rounded-lg shadow-2xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteSelected}
              disabled={!selectedMessageIds.length || isPending}
              className={cn(
                "h-9 px-4 text-xs font-lato font-bold flex items-center gap-2 transition-all duration-300 rounded-lg shadow-sm border-none cursor-pointer",
                selectedMessageIds.length > 0
                  ? "bg-destructive text-white hover:bg-destructive/90 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-destructive/10 text-destructive cursor-not-allowed opacity-60",
              )}
            >
              <Trash2 size={13} strokeWidth={2.5} /> Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Messages Stream Viewport */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-background custom-scrollbar"
      >
        {/* Top Pagination Sentinel Indicator */}
        <div
          ref={topSentinelRef}
          className="w-full h-4 flex items-center justify-center"
        >
          {isLoadingMore && (
            <div className="p-1.5 bg-muted/40 backdrop-blur-sm rounded-full border border-border/30">
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
            </div>
          )}
        </div>

        {chatMessages.map((message, index) => {
          const isOwnMessage = message.senderId === userId;
          const isSeen = Boolean(message.seenAt);
          const isDeleted = message.isDeleted;
          const isSelected = selectedMessageIds.includes(message.id);

          const currentDateLabel = formatDateFns(message.createdAt, "smart");
          const previousDateLabel =
            index > 0
              ? formatDateFns(chatMessages[index - 1].createdAt, "smart")
              : null;
          const showDateSeparator = currentDateLabel !== previousDateLabel;

          return (
            <div key={message.id} className="w-full flex flex-col">
              {/* Elegant Floating Chrono-Separator */}
              {showDateSeparator && (
                <div className="flex justify-center my-6 animate-in fade-in duration-300">
                  <span className="rounded-full bg-muted/50 border border-border/30 px-3.5 py-1 text-[10px] font-lato font-bold text-muted-foreground tracking-widest uppercase shadow-2xs">
                    {currentDateLabel}
                  </span>
                </div>
              )}

              {/* Individual Message Node Core */}
              <div
                onClick={() =>
                  toggleSelectMessage(message.id, isOwnMessage, isDeleted)
                }
                className={cn(
                  "flex items-end gap-3.5 group select-none py-0.5 max-w-full transition-all duration-200",
                  isOwnMessage ? "justify-end" : "justify-start",
                  isSelectionMode && isOwnMessage && !isDeleted
                    ? "cursor-pointer"
                    : "",
                )}
              >
                {/* Premium Circular Selection Indicator Nodes */}
                {isSelectionMode && isOwnMessage && !isDeleted && (
                  <div
                    className={cn(
                      "pb-2.5 transition-all duration-300 ease-out animate-in zoom-in-75",
                      isOwnMessage ? "order-first mr-1" : "ml-1",
                    )}
                  >
                    {isSelected ? (
                      <div className="size-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm animate-in scale-in duration-150">
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 4.5L3.5 7L9 1" />
                        </svg>
                      </div>
                    ) : (
                      <div className="size-5 rounded-full border-2 border-border bg-background group-hover:border-input transition-colors duration-200" />
                    )}
                  </div>
                )}

                {/* Modernized Base Bubble Container */}
                <div
                  className={cn(
                    "max-w-[72%] sm:max-w-[62%] rounded-xl px-4 pt-3.5 pb-2.5 relative transition-all duration-300 ease-out flex flex-col",
                    isOwnMessage ? "text-foreground" : "text-foreground",
                    isSelected
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[0.98] opacity-95 shadow-md"
                      : "",
                    isDeleted &&
                      (isOwnMessage
                        ? "bg-primary text-white/75"
                        : "bg-secondary text-muted-foreground"),
                  )}
                >
                  {isDeleted ? (
                    <div className="flex items-center gap-2 italic py-0.5">
                      <Ban size={14} className="shrink-0 opacity-80" />
                      <span className="font-lato text-xs tracking-wide">
                        This message was removed
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Message Payload Body Text */}
                      <p className="wrap-break-word text-sm leading-relaxed font-sans whitespace-pre-wrap tracking-tight text-foreground/90">
                        {message.message}
                      </p>

                      {/* High-Fidelity Micro-Badge Tracker Component */}
                      <div
                        className={cn(
                          "mt-2 flex items-center gap-1.5 text-[10px] font-sans font-normal tracking-wider uppercase px-2 py-0.5 rounded-lg shadow-2xs w-fit transition-all duration-200 select-none",
                          isOwnMessage
                            ? "self-end bg-primary text-primary-foreground px-3"
                            : "self-start bg-secondary border border-border/40 text-muted-foreground",
                        )}
                      >
                        <span>{formatDateFns(message.createdAt, "time")}</span>
                        {isOwnMessage && (
                          <span className="shrink-0 flex items-center ml-0.5">
                            {isSeen ? (
                              <CheckCheck
                                size={11}
                                strokeWidth={3}
                                className="text-primary-foreground"
                              />
                            ) : (
                              <Check
                                size={11}
                                strokeWidth={3}
                                className="text-primary-foreground/80"
                              />
                            )}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Premium Translucent Live Typing Stream Indicator */}
        {isOtherUserTyping && (
          <div className="flex justify-start items-center gap-2 py-1 animate-in fade-in-50 duration-300 slide-in-from-bottom-2">
            <div className="bg-muted/50 border border-border/20 rounded-2xl rounded-bl-xs px-4 py-3.5 flex items-center gap-1.5 shadow-2xs">
              <span className="size-1.5 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="size-1.5 bg-primary/70 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="size-1.5 bg-primary/70 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        {/* Auto-Scroll Injected Anchor Element */}
        <div ref={messagesEndRef} />
      </div>

      {/* Integrated Cohesive Text Input Row Component */}
      <ChatInput
        conversationId={conversationId}
        userId={userId}
        isSelectionMode={isSelectionMode}
        isPending={isPending}
        onSendMessage={handleSendAction}
      />
    </>
  );
}
