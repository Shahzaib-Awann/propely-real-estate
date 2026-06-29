// @/components/pages/chat/conversation-view.tsx

import {
  getConversationById,
  getConversationMessages,
  getTotalUnreadMessages,
  markConversationAsSeen,
} from "@/lib/actions/chat.action";
import ConversationMessages from "./conversation-messages";

interface Props {
  conversationId: string;
  userId: number;
}

export default async function ConversationView({
  conversationId,
  userId,
}: Props) {

  // 1. Kick off all independent database reads concurrently
  const [conversation, unReadMessages, messages] = await Promise.all([
    getConversationById(conversationId, userId),
    getTotalUnreadMessages({ conversationId, userId, scope: "single" }),
    getConversationMessages({ conversationId, limit: 30, }),
  ]);

  // 2. Perform the database write update only if a valid conversation exists
  if (conversation) {
    await markConversationAsSeen(conversationId, userId);
  }

  return (
    <div className="flex flex-col flex-1">
      <ConversationMessages
        messages={messages}
        conversationId={conversationId}
        userId={userId}
        unReadMessages={unReadMessages}
        conversation={conversation}
      />
    </div>
  );
}