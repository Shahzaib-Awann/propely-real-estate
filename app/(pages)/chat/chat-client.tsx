// @/app/(pages)/chat/chat-client.tsx

import ConversationList from "@/components/pages/chat/conversation-list";
import ConversationView from "@/components/pages/chat/conversation-view";
import EmptyState from "@/components/pages/chat/empty-state";
import { getUserConversations } from "@/lib/actions/chat.action";
import ConversationRoom from "@/lib/conversation-room";

interface ChatClientProps {
  activeConversationId?: string;
  userId: number;
}

export default async function ChatClient({
  activeConversationId,
  userId
}: ChatClientProps) {

  const conversations = await getUserConversations(Number(userId))

  return (
    <main className="h-[calc(100vh-80px)] flex">

  {activeConversationId && (
    <ConversationRoom
      conversationId={activeConversationId}
    />
  )}

      {/* Left Sidebar */}
      <aside
        className={`
          border-r bg-background
          w-full lg:w-[380px]
          ${activeConversationId ? "hidden lg:block" : ""}
        `}
      >
        <ConversationList userId={userId} activeConversationId={activeConversationId} conversations={conversations}/>
      </aside>

      {/* Right Content */}
      <section
        className={`
          flex-1
          ${!activeConversationId ? "hidden lg:flex" : "flex"}
        `}
      >
        {activeConversationId ? (
          <ConversationView
            conversationId={activeConversationId}
            userId={userId}
          />
        ) : (
          <EmptyState />
        )}
      </section>
    </main>
  );
}