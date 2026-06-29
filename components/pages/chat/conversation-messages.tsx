"use client";

// @/components/pages/chat/conversation-messages.tsx

import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Ban, Check, CheckCheck, CheckSquare, Square, Trash2 } from "lucide-react";
import { cn, formatDateFns } from "@/lib/utils/general";
import { socket } from "@/lib/socket/client";
import { SOCKET_EVENTS } from "@/lib/socket/socket-events";
import { ConversationHeader, RealtimeMessage } from "@/types/propely.chat";
import { useChatStore } from "@/lib/store/use-chat-store";
import { Button } from "@/components/ui/button";

import ChatHeader from "./chat-header";
import ChatInput from "./chat-input";
import { deleteMessages, getConversationMessages, sendMessage } from "@/lib/actions/chat.action";

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
  const [isPending, startTransition] = useTransition();
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

  useEffect(() => {
    setChatMessages(messages);
    setHasMore(messages.length === 30);
    isInitialRender.current = true;
  }, [messages]);

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
              requestAnimationFrame(() => {
                if (container) {
                  container.scrollTop = container.scrollHeight - previousScrollHeight + previousScrollTop;
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
      { root: scrollContainerRef.current, threshold: 0.1 }
    );

    const currentSentinel = topSentinelRef.current;
    if (currentSentinel) observer.observe(currentSentinel);
    return () => { if (currentSentinel) observer.unobserve(currentSentinel); };
  }, [hasMore, isLoadingMore, chatMessages, conversationId]);

  useEffect(() => {
    if (unreadCount > 0) useChatStore.getState().reduceUnreadCount(unreadCount);
  }, [unreadCount, conversationId]);

  // Socket Core Connections Pipe Loop
  useEffect(() => {
    if (!conversationId) return;

    socket.emit(SOCKET_EVENTS.MESSAGE_SEEN, { conversationId, viewerId: userId });

    const handleNewMessage = (message: RealtimeMessage) => {
      setChatMessages((prev) => prev.some((m) => m.id === message.id) ? prev : [...prev, message]);
      if (message.senderId !== userId) {
        socket.emit(SOCKET_EVENTS.MESSAGE_SEEN, { conversationId, viewerId: userId });
      }
    };

    const handleMessageSeen = ({ conversationId: id, viewerId }: { conversationId: string; viewerId: number }) => {
      if (Number(viewerId) !== Number(userId) && id === conversationId) {
        setChatMessages((prev) => prev.map((msg) => ({ ...msg, seenAt: msg.seenAt ?? new Date().toISOString() })));
      }
    };

    const handleMessagesDeleted = ({ messageIds }: { messageIds: string[] }) => {
      setChatMessages((prev) => prev.map((msg) => messageIds.includes(msg.id) ? { ...msg, isDeleted: true, deletedAt: new Date().toISOString() } : msg));
    };

    const handleTypingStart = (p: { conversationId: string; userId: number }) => {
      if (p.conversationId === conversationId && Number(p.userId) !== Number(userId)) setIsOtherUserTyping(true);
    };

    const handleTypingStop = (p: { conversationId: string; userId: number }) => {
      if (p.conversationId === conversationId && Number(p.userId) !== Number(userId)) setIsOtherUserTyping(false);
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

  const toggleSelectMessage = (id: string, isOwnMessage: boolean, isDeleted: boolean) => {
    if (!isSelectionMode || !isOwnMessage || isDeleted) return;
    setSelectedMessageIds((prev) => prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]);
  };

  const handleDeleteSelected = () => {
    if (!selectedMessageIds.length) return;
    startTransition(async () => {
      const res = await deleteMessages({ messageIds: selectedMessageIds, userId, conversationId });
      if (res.success && res.messageIds) {
        socket.emit(SOCKET_EVENTS.MESSAGES_DELETED, { conversationId, messageIds: res.messageIds });
        setSelectedMessageIds([]);
        setIsSelectionMode(false);
      }
    });
  };

  const handleSendAction = async (messageText: string) => {
    startTransition(async () => {
      const savedMessage = await sendMessage({ conversationId, senderId: userId, message: messageText });
      if (savedMessage) socket.emit(SOCKET_EVENTS.SEND_MESSAGE, savedMessage);
    });
  };

  return (
    <>
      <ChatHeader conversation={conversation} onSelectMessagesMode={() => setIsSelectionMode(true)} />

      {isSelectionMode && (
        <div className="bg-card-foreground/5 dark:bg-card-foreground/20 px-4 py-2 border-b border-border flex justify-between items-center h-14 animate-in slide-in-from-top-2 duration-200">
          <span className="font-lato font-medium text-sm text-foreground/70">{selectedMessageIds.length} message{selectedMessageIds.length !== 1 ? "s" : ""} selected</span>
          <div className="flex gap-2">
            <Button onClick={() => { setIsSelectionMode(false); setSelectedMessageIds([]); }} variant="outline" className="h-9 px-4 text-xs font-lato font-medium border-border hover:bg-background transition-all">Cancel</Button>
            <Button onClick={handleDeleteSelected} disabled={!selectedMessageIds.length || isPending} className={cn("h-9 px-4 text-xs font-lato font-medium flex items-center gap-1.5 transition-all", selectedMessageIds.length > 0 ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-200 dark:bg-red-950/40 text-red-400 dark:text-red-900 cursor-not-allowed")}>
              <Trash2 size={13} /> Delete Selected
            </Button>
          </div>
        </div>
      )}

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
        <div ref={topSentinelRef} className="w-full h-2 flex items-center justify-center">
          {isLoadingMore && <Loader2 className="h-5 w-5 text-primary animate-spin opacity-70" />}
        </div>

        {chatMessages.map((message, index) => {
          const isOwnMessage = message.senderId === userId;
          const isSeen = Boolean(message.seenAt);
          const isDeleted = message.isDeleted;
          const isSelected = selectedMessageIds.includes(message.id);

          const currentDateLabel = formatDateFns(message.createdAt, "smart");
          const previousDateLabel = index > 0 ? formatDateFns(chatMessages[index - 1].createdAt, "smart") : null;
          const showDateSeparator = currentDateLabel !== previousDateLabel;

          return (
            <div key={message.id} className="w-full flex flex-col">
              {showDateSeparator && (
                <div className="flex justify-center my-6">
                  <span className="rounded-full bg-card-foreground/5 dark:bg-card-foreground/10 px-4 py-1 text-[11px] font-lato font-semibold text-foreground/50 tracking-wider uppercase">
                    {currentDateLabel}
                  </span>
                </div>
              )}

              <div
                onClick={() => toggleSelectMessage(message.id, isOwnMessage, isDeleted)}
                className={cn("flex items-end gap-3 group select-none py-0.5 max-w-full transition-all", isOwnMessage ? "justify-end" : "justify-start", isSelectionMode && isOwnMessage && !isDeleted ? "cursor-pointer hover:opacity-90" : "")}
              >
                {isSelectionMode && isOwnMessage && !isDeleted && (
                  <div className={cn("pb-2 transition-transform duration-200", isOwnMessage ? "order-first mr-1" : "ml-1")}>
                    {isSelected ? <CheckSquare size={18} className="text-primary fill-primary/10" /> : <Square size={18} className="text-foreground/30 hover:text-foreground/50" />}
                  </div>
                )}

                <div className={cn("max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-xs relative transition-all", isOwnMessage ? "bg-primary text-primary-foreground rounded-br-xs" : "bg-card-foreground/5 dark:bg-card-foreground/10 text-foreground rounded-bl-xs", isSelected ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-background scale-[0.99]" : "")}>
                  {isDeleted ? (
                    <div className="flex items-center gap-2 italic opacity-60 text-xs py-0.5">
                      <Ban size={14} className="shrink-0" />
                      <span className="font-lato text-sm">This message was removed</span>
                    </div>
                  ) : (
                    <p className="break-words text-sm leading-relaxed font-sans whitespace-pre-wrap">{message.message}</p>
                  )}

                  {!isDeleted && (
                    <div className={cn("mt-1.5 flex items-center justify-end gap-1 text-[11px] font-lato tracking-wide uppercase opacity-55", isOwnMessage ? "text-primary-foreground" : "text-foreground/80")}>
                      <span>{formatDateFns(message.createdAt, "time")}</span>
                      {isOwnMessage && (
                        <span className="shrink-0 ml-0.5">
                          {isSeen ? <CheckCheck size={13} className="text-primary-foreground" /> : <Check size={12} className="text-primary-foreground/70" />}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isOtherUserTyping && (
          <div className="flex justify-start items-center gap-2 py-2 animate-in fade-in-50 duration-300">
            <div className="bg-card-foreground/5 dark:bg-card-foreground/10 rounded-2xl rounded-bl-xs px-4 py-3.5 flex items-center gap-1.5">
              <span className="size-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="size-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="size-1.5 bg-foreground/40 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

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