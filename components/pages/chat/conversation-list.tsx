"use client";

// @/components/pages/chat/conversation-list.tsx

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { socket } from "@/lib/socket/client";
import { SOCKET_EVENTS } from "@/lib/socket/socket-events";
import { formatLastMessageTime } from "@/lib/utils/general";
import { ConversationListItem } from "@/types/propely.chat";
import { SideBarUpdatePayload } from "@/lib/socket/socket-types";

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
    const handleMessageSeen = ({ conversationId }: { conversationId: string }) => {
      setItems((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
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
        {items?.map((conversation) => {
          const isActive = activeConversationId === conversation.id;

          return (
            <Link
              key={conversation.id}
              href={`/chat/${conversation.id}`}
              className={`block border-b p-4 transition ${
                isActive ? "bg-muted" : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{conversation.otherUserName}</h3>
                <span className="text-xs text-muted-foreground">
                  {conversation.lastMessageAt ? formatLastMessageTime(conversation.lastMessageAt) : ""}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">{conversation.propertyTitle}</p>

              <div className="flex items-center justify-between">
                <p className="text-sm truncate max-w-[80%]">{conversation.lastMessage}</p>
                {conversation.unreadCount > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;