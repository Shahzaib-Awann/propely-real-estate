"use client";

// @/components/pages/chat/conversation-list.tsx

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { socket } from "@/lib/socket/client";
import { SOCKET_EVENTS } from "@/lib/socket/socket-events";
import { formatLastMessageTime } from "@/lib/utils/general";
import { ConversationListItem } from "@/types/propely.chat";
import { SideBarUpdatePayload } from "@/lib/socket/socket-types";
import { usePresenceStore } from "@/lib/store/use-presence-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/lib/store/use-chat-store";

interface ConversationListProps {
  userId: number;
  activeConversationId?: string;
  conversations: ConversationListItem[];
}

const ConversationList = ({ userId , activeConversationId, conversations }: ConversationListProps) => {
  const [items, setItems] = useState<ConversationListItem[]>(conversations);

  // Keep track of the active ID in a mutable ref to prevent socket listener teardowns
  const activeIdRef = useRef(activeConversationId);

  useEffect(() => {
    activeIdRef.current = activeConversationId;
  }, [activeConversationId]);

  // Combined and permanent real-time socket updates
  useEffect(() => {
    const handleMessageSeen = ({ conversationId, viewerId }: { conversationId: string; viewerId: number }) => {
  setItems((prev) =>
    prev.map((conv) => {
      if (conv.id === conversationId) {
        if (Number(viewerId) === Number(userId) && conv.unreadCount > 0) {
          useChatStore.getState().reduceUnreadCount(conv.unreadCount);
        }
        return { ...conv, unreadCount: 0 };
      }
      return conv;
    })
  );
};

    const handleSidebarUpdate = (payload: SideBarUpdatePayload) => {
      setItems((prev) => {
        const updated = prev.map((conversation) => {
          if (conversation.id !== payload.conversationId) {
            return conversation;
          }

          // Read the latest active ID from our ref securely without re-binding the event listener
          const isActive = activeIdRef.current === conversation.id;

          return {
            ...conversation,
            lastMessage: payload.lastMessage,
            lastMessageAt: payload.lastMessageAt,
            unreadCount: isActive
              ? 0
              : (conversation.unreadCount ?? 0) + 1,
          };
        });

        return [...updated].sort(
          (a, b) => new Date(b.lastMessageAt ?? 0).getTime() - new Date(a.lastMessageAt ?? 0).getTime()
        );
      });
    };

    socket.on(SOCKET_EVENTS.MESSAGE_SEEN, handleMessageSeen);
    socket.on(SOCKET_EVENTS.SIDEBAR_UPDATE, handleSidebarUpdate);

    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_SEEN, handleMessageSeen);
      socket.off(SOCKET_EVENTS.SIDEBAR_UPDATE, handleSidebarUpdate);
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {items?.map((conversation) => (
  <ConversationRow
    key={conversation.id}
    conversation={conversation}
    isActive={
      activeConversationId === conversation.id
    }
  />
))}
      </div>
    </div>
  );
};

export default ConversationList;


function ConversationRow({
  conversation,
  isActive,
}: {
  conversation: ConversationListItem;
  isActive: boolean;
}) {

  const isOnline = usePresenceStore((state) =>
    state.isUserOnline(conversation.otherUserId)
  );

  return (
    <Link
      href={`/chat/${conversation.id}`}
      className={`
        flex items-center gap-3 px-4 py-3 group border-b
        transition-all duration-200
        ${
          isActive
            ? "bg-muted"
            : "hover:bg-muted/60"
        }
      `}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <Avatar className="h-12 w-12 shadow-sm">
          <AvatarImage
            src={
              conversation.otherUserAvatar ??
              undefined
            }
            alt={conversation.otherUserName}
            className="group-hover:scale-110 transition-all duration-300"
          />
          <AvatarFallback>
            {conversation.otherUserName
              ?.slice(0, 2)
              .toUpperCase() ?? "GU"}
          </AvatarFallback>
        </Avatar>

        {isOnline && (
          <span className="absolute bottom-0 size-4 transition-all duration-500 right-0 rounded-full border-2 border-background bg-green-500" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-medium">
              {conversation.otherUserName}
            </h3>

            <p className="truncate text-xs text-muted-foreground">
              {conversation.propertyTitle}
            </p>
          </div>

          <span className="shrink-0 text-xs text-muted-foreground">
            {conversation.lastMessageAt
              ? formatLastMessageTime(
                  conversation.lastMessageAt
                )
              : ""}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <p className="truncate text-sm text-muted-foreground">
            {conversation.lastMessage}
          </p>

          {conversation.unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-medium text-primary-foreground">
              {conversation.unreadCount > 99
                ? "99+"
                : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}