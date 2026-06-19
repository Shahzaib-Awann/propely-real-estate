// @/components/pages/chat/conversation-list.tsx

import { getUserConversations } from "@/lib/actions/chat.action";
import { formatLastMessageTime } from "@/lib/utils/general";
import Link from "next/link";

interface ConversationListProps {
  userId: number;
  activeConversationId?: string;
}

const ConversationList = async ({userId, activeConversationId}: ConversationListProps) => {

  const conversations = await getUserConversations(Number(userId))

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4">
        <h1 className="text-2xl font-bold">
          Messages
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
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