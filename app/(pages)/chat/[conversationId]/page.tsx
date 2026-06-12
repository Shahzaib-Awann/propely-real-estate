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

  return (
    <ChatClient
      activeConversationId={conversationId}
    />
  );
}