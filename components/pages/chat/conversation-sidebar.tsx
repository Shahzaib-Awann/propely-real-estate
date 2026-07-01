"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { socket } from "@/lib/socket/client";
import { SOCKET_EVENTS } from "@/lib/socket/socket-events";
import { formatLastMessageTime, getAvatarFallback } from "@/lib/utils/general";
import { ConversationListItem } from "@/types/propely.chat";
import { SideBarUpdatePayload } from "@/lib/socket/socket-types";
import { usePresenceStore } from "@/lib/store/use-presence-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/lib/store/use-chat-store";
import { Search, SlidersHorizontal } from "lucide-react";

interface ConversationListProps {
  userId: number;
  activeConversationId?: string;
  conversations: ConversationListItem[];
}

const ConversationList = ({
  userId,
  activeConversationId,
  conversations,
}: ConversationListProps) => {

  // Local states
  const [items, setItems] = useState<ConversationListItem[]>(conversations);
  const [searchQuery, setSearchQuery] = useState("");

  // Ref to keep track of active conversation
  const activeIdRef = useRef(activeConversationId);

  /**
   * Keep active conversation ref in sync with props
   */
  useEffect(() => {
    activeIdRef.current = activeConversationId;
  }, [activeConversationId]);

  /**
   * Socket listeners for real-time sidebar updates
   */
  useEffect(() => {

    // Handle messages seen event
    const handleMessageSeen = ({ conversationId, viewerId }: { conversationId: string; viewerId: number }) => {

      // Update global unread count if user's messages were seen
      if (Number(viewerId) === Number(userId)) {
        const conversation = items.find((c) => c.id === conversationId);
        if (conversation && conversation.unreadCount > 0) {
          useChatStore.getState().reduceUnreadCount(conversation.unreadCount);
        }
      }

      // Mark conversation as read locally
      setItems((prev) =>
        prev.map((conv) => (conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv))
      );
    };

    /**
     * Handles sidebar updates (new messages, updates, etc.)
     */
    const handleSidebarUpdate = (payload: SideBarUpdatePayload) => {
      setItems((prev) => {
        const updated = prev.map((conversation) => {
          if (conversation.id !== payload.conversationId) return conversation;
          const isActive = activeIdRef.current === conversation.id;

          return {
            ...conversation,
            lastMessage: payload.lastMessage,
            lastMessageAt: payload.lastMessageAt,
            unreadCount: isActive ? 0 : (conversation.unreadCount ?? 0) + 1,
          };
        });

        // Sort conversations by latest activity
        return [...updated].sort(
          (a, b) => new Date(b.lastMessageAt ?? 0).getTime() - new Date(a.lastMessageAt ?? 0).getTime()
        );
      });
    };

    // Register event listeners
    socket.on(SOCKET_EVENTS.MESSAGE_SEEN, handleMessageSeen);
    socket.on(SOCKET_EVENTS.SIDEBAR_UPDATE, handleSidebarUpdate);

    return () => {
      // Cleanup event listeners
      socket.off(SOCKET_EVENTS.MESSAGE_SEEN, handleMessageSeen);
      socket.off(SOCKET_EVENTS.SIDEBAR_UPDATE, handleSidebarUpdate);
    };
  }, [items, userId]);

  /**
   * Filter conversations based on search input
   */
  const filteredItems = items.filter((item) =>
    item.otherUserName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total unread count
  const { totalUnreadCount: totalUnread } = useChatStore();

  return (
    <div className="h-full flex flex-col bg-transparent font-sans text-foreground">
      {/* Header Panel Zone */}
      <div className="px-5 pt-6 pb-4 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-lato font-bold text-2xl tracking-tight">Messages</h1>
            {totalUnread > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-2xs">
                {totalUnread} new
              </span>
            )}
          </div>
          <button className="p-2 hover:bg-background/80 text-muted-foreground hover:text-foreground rounded-radius transition-all duration-200 cursor-pointer">
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Integrated Cohesive Search Input */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 text-muted-foreground pointer-events-none" size={18} />
          <input
            type="text"
            placeholder="Search conversations or properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 h-12 bg-background focus:bg-white border border-border focus:border-input rounded-xl text-sm placeholder-muted-foreground outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* Conversations Stream Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col gap-2.5 custom-scrollbar">
        {filteredItems.length > 0 ? (
          filteredItems.map((conversation) => (
            <ConversationRow
              key={conversation.id}
              conversation={conversation}
              isActive={activeConversationId === conversation.id}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <p className="text-muted-foreground text-sm font-medium font-lato">No conversations found</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Try modifying your search query</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;



/**
 * === Conversation Row Component ===
 *
 * Represents a single conversation item in the sidebar list.
 */
function ConversationRow({ conversation, isActive }: { conversation: ConversationListItem; isActive: boolean }) {

  // Check if the other user is currently online
  const isOnline = usePresenceStore((state) => state.isUserOnline(String(conversation.otherUserId)));

  // Check if conversation has unread messages
  const hasUnread = conversation.unreadCount > 0;

  return (
    <Link
      href={`/chat/${conversation.id}`}
      className={`group flex items-center hover:bg-white gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 relative ${
        isActive
          ? "bg-white"
          : "bg-background"
      }`}
    >
      {/* Left Accent indicator line for active item */}
      {isActive && (
      <span className="absolute left-0 top-1/2 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-all duration-300 ease-out h-1/2 translate-x-0 opacity-100" />
      )}

      {/* Dynamic Avatar Frame with Micro-Hover Animation */}
      <div className="relative shrink-0">
        <Avatar className={`h-12 w-12 shadow-sm transition-all duration-200`}>
          <AvatarImage
            src={conversation.otherUserAvatar ?? undefined}
            alt={conversation.otherUserName}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-sm">
            {getAvatarFallback(conversation.otherUserName)}
          </AvatarFallback>
        </Avatar>

        {/* Crisp Absolute Status Dot */}
        {isOnline && (
          <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 shadow-sm border-background bg-emerald-500 transition-all duration-200 group-hover:scale-110 shadow-2xs"
          />
        )}
      </div>

      {/* Text Data Node Metadata Blocks */}
      <div className="min-w-0 flex-1 flex flex-col justify-between h-12">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className={`truncate font-lato text-sm tracking-tight transition-colors ${
            hasUnread || isActive ? "font-bold text-foreground" : "font-semibold text-foreground/80"
          }`}>
            {conversation.otherUserName}
          </h3>
          <span className={`shrink-0 text-[11px] font-sans tracking-wide transition-colors ${
            hasUnread ? "font-semibold text-primary" : "text-muted-foreground"
          }`}>
            {conversation.lastMessageAt ? formatLastMessageTime(conversation.lastMessageAt) : ""}
          </span>
        </div>

        <div className="flex flex-col mt-0.5">
          {/* Upper-Case Micro Badge Variant mapping to your 404/Hero logic */}
          <p className="truncate text-[10px] tracking-wider uppercase font-bold text-stone-500/70 mb-0.5">
            {conversation.propertyTitle || "Direct Message"}
          </p>
          <div className="flex items-center justify-between gap-2 min-w-0">
            <p className={`truncate text-xs ${
              hasUnread ? "font-medium text-foreground" : "text-muted-foreground"
            }`}>
              {conversation.lastMessage}
            </p>

            {/* Premium Unread Counter Dot Badge */}
            {hasUnread && (
              <span className="shrink-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground shadow-xs animate-in zoom-in-75 duration-200">
                {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}