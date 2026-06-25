// @/components/pages/chat/conversation-view.tsx

import {
  getConversationById,
  getConversationMessages,
  getTotalUnreadMessages,
  markConversationAsSeen,
} from "@/lib/actions/chat.action";
import ConversationMessages from "./conversation-messages";
import ConversationMessageHeader from "./conversation-message-header";

interface Props {
  conversationId: string;
  userId: number;
}

export default async function ConversationView({
  conversationId,
  userId,
}: Props) {
  const conversation = await getConversationById(conversationId, userId);

  const unReadMessages = await getTotalUnreadMessages({ conversationId, userId, scope: "single" })

  await markConversationAsSeen(conversationId, userId);

  const messages = await getConversationMessages(conversationId);

  return (
    <div className="flex flex-col flex-1">
      <ConversationMessageHeader conversation={conversation} />

      <ConversationMessages
        messages={messages}
        conversationId={conversationId}
        userId={userId}
        unReadMessages={unReadMessages}
      />
    </div>
  );
}