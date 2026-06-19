// @/components/pages/chat/conversation-view.tsx

import {
  getConversationById,
  getConversationMessages,
  markConversationAsSeen,
} from "@/lib/actions/chat.action";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ConversationMessages from "./conversation-messages";

interface Props {
  conversationId: string;
  userId: number;
}

export default async function ConversationView({
  conversationId,
  userId,
}: Props) {
  const conversation = await getConversationById({
    conversationId,
    userId,
  });

  await markConversationAsSeen({
    conversationId,
    viewerId: userId,
  });

  const messages = await getConversationMessages({
    conversationId,
  });

  return (
    <div className="flex flex-col flex-1">
      <header className="border-b p-4 flex items-center gap-4">
        <Link href="/chat" className="lg:hidden">
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h2 className="font-semibold">
            {conversation?.otherUser.name}
          </h2>

          <p className="text-sm text-muted-foreground">
            {conversation?.property.title}
          </p>
        </div>
      </header>

      <ConversationMessages
        messages={messages ?? []}
        conversationId={conversationId}
        userId={userId}
      />
    </div>
  );
}