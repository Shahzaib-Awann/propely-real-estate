"use client";

import { socket } from "@/lib/socket";
import { SOCKET_EVENTS } from "@/lib/socket-events";
// @/components/pages/chat/conversation-list.tsx

import { formatLastMessageTime } from "@/lib/utils/general";
import { ConversationListItem, RealtimeMessage } from "@/types/propely.chat";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ConversationListProps {
  userId: number;
  activeConversationId?: string;
  conversations: ConversationListItem[];
}

const ConversationList = ({userId, activeConversationId, conversations}: ConversationListProps) => {

  const [items, setItems] = useState(conversations);

  useEffect(() => {
  setItems(conversations);
}, [conversations]);

useEffect(() => {
  const handleMessageSeen = ({
    conversationId,
  }: {
    conversationId: string;
  }) => {
    setItems((prev) =>
      prev.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        return {
          ...conversation,
          unreadCount: 0,
        };
      })
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
}, []);

useEffect(() => {
  const handleNewMessage = (message: RealtimeMessage) => {
    setItems((prev) => {
      const updated = prev.map((conversation) => {
        if (conversation.id !== message.conversationId) {
          return conversation;
        }

        const isActive =
          activeConversationId === conversation.id;

        return {
          ...conversation,
          lastMessage: message.message,
          lastMessageAt: message.createdAt,

          // 🔥 IMPORTANT FIX
          unreadCount: isActive
            ? 0
            : (conversation.unreadCount ?? 0) + 1,
        };
      });

      // IMPORTANT: sort AFTER mapping
      return [...updated].sort(
        (a, b) =>
          new Date(b.lastMessageAt ?? 0).getTime() -
          new Date(a.lastMessageAt ?? 0).getTime()
      );
    });
  };

  socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);

  return () => {
    socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
  };
}, [activeConversationId]);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4">
        <h1 className="text-2xl font-bold">
          Messages
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {items?.map((conversation) => {
          const isActive =
            activeConversationId === conversation.id;

          return (
            <Link
              key={conversation.id}
              href={`/chat/${conversation.id}`}
              className={`block border-b p-4 transition ${
                isActive ? "bg-muted" : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {conversation.otherUserName}
                </h3>

                <span className="text-xs text-muted-foreground">
                  {formatLastMessageTime(conversation.lastMessageAt!)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                {conversation.propertyTitle}
              </p>

              <div className="flex items-center justify-between">
                <p className="text-sm truncate max-w-[80%]">
                  {conversation.lastMessage}
                </p>

                {/* Unread badge */}
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
}

export default ConversationList;