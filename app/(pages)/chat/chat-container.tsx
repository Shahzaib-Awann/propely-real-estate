// @/app/(pages)/chat/chat-container.tsx

import ConversationList from "@/components/pages/chat/conversation-list";
import ConversationView from "@/components/pages/chat/conversation-view";
import EmptyState from "@/components/pages/chat/empty-state";
import ConversationSocketRoom from "@/components/providers/socket/conversation-socket-room";
import { getUserConversations } from "@/lib/actions/chat.action";

interface ChatClientProps {
  activeConversationId?: string;
  userId: number;
}

export default async function ChatContainer({
  activeConversationId,
  userId,
}: ChatClientProps) {
  const conversations = await getUserConversations(Number(userId));

  return (
    <main className="h-[calc(100vh-80px)] flex flex-row px-0 lg:px-4">
      {activeConversationId && (
        <ConversationSocketRoom conversationId={activeConversationId} />
      )}
      {/* Left Content */}
      <section
        className={`
              flex-3
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

      {/* Right Sidebar */}
      <aside
        className={`
          bg-background lg:bg-side-panel
          w-full flex-2
          ${activeConversationId ? "hidden lg:block" : ""}
        `}
      >
        <ConversationList
          userId={userId}
          activeConversationId={activeConversationId}
          conversations={conversations}
        />
      </aside>
    </main>
  );
}
