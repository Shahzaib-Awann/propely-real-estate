import { auth } from "@/auth";
import ChatContainer from "../chat-container";

import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Conversation",
  description:
    "Private conversation between buyers and sellers.",
  path: "/chat",
  noIndex: true,
});

interface PageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export default async function ConversationPage({
  params,
}: PageProps) {
  /* Get conversation ID from params */
  const { conversationId } = await params;

  /* Authenticate User */
  const session = await auth()
  const userId = session?.user?.id;

  return (
    <ChatContainer
      activeConversationId={conversationId}
      userId={Number(userId)}
    />
  );
}