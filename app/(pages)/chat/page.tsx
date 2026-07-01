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

export default async function ChatPage({ searchParams }: ChatPageProps) {
  /* Fetch authenticated user session on the server. */
  const session = await auth();
  const userId = Number(session?.user?.id);

  /* Extract property ID from query parameters. */
  const { property } = await searchParams;

  /* If no 'property' is found, render the default chat view */
  if (!property) {
    return <ChatContainer userId={userId} />;
  }

  /* If 'property' exists, fetch or create a conversation for that property. */
  const { conversationId } = await createOrGetConversation({
    buyerId: userId,
    postId: property,
  });

  /* If a conversation is created/found, redirect user to that conversation view. */
  if (conversationId) {
    redirect(`/chat/${conversationId}`);
  }

  /* Fallback to default chat view if no conversation is created/found */
  return <ChatContainer userId={userId} />;
}
