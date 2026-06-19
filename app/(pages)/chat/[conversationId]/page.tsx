// @/app/(pages)/chat/[conversationId]/page.tsx

import { auth } from "@/auth";
import ChatClient from "../chat-client";

interface PageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export default async function ConversationPage({
  params,
}: PageProps) {
  const { conversationId } = await params;

  const session = await auth()
  const userId = session?.user?.id;

  return (
    <ChatClient
      activeConversationId={conversationId}
      userId={Number(userId)}
    />
  );
}