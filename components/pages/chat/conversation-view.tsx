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

  // Fetch all required data in parallel for performance
  const [conversation, unReadMessages, messages] = await Promise.all([
    getConversationById(conversationId, userId),
    getTotalUnreadMessages({ conversationId, userId, scope: "single" }),
    getConversationMessages({ conversationId, limit: 30, }),
  ]);

  // Mark conversation as seen once data is loaded
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