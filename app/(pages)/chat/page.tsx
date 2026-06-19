// @/app/(pages)/chat/page.tsx

import { auth } from "@/auth";
import ChatClient from "./chat-client";
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
    return <ChatClient userId={userId} />;
  }

  const { conversationId } = await createOrGetConversation({
    buyerId: userId,
    postId: property,
  });

  if (conversationId) {
    redirect(`/chat/${conversationId}`);
  }

  return <ChatClient userId={userId} />;
}