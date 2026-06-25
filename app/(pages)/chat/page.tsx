// @/app/(pages)/chat/page.tsx

import { auth } from "@/auth";
import ChatContainer from "./chat-container";
import { createOrGetConversation } from "@/lib/actions/chat.action";
import { redirect } from "next/navigation";


interface ChatPageProps {
  searchParams: Promise<{
    property?: string;
  }>;
}

export default async function ChatPage({
  searchParams,
}: ChatPageProps) {
  const session = await auth();
  const userId = Number(session?.user?.id);

  const { property } = await searchParams;

  if (!property) {
    return <ChatContainer userId={userId} />;
  }

  const { conversationId } = await createOrGetConversation({
    buyerId: userId,
    postId: property,
  });

  if (conversationId) {
    redirect(`/chat/${conversationId}`);
  }

  return <ChatContainer userId={userId} />;
}