// @/app/(pages)/chat/chat-container.tsx

import ConversationList from "@/components/pages/chat/conversation-sidebar";
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

  /* Fetch all conversations belonging to the current user. */
  const conversations = await getUserConversations(Number(userId));

  return (
    <main className="h-[calc(100vh-80px)] flex flex-row px-0 lg:px-4">
      {/* Socket connection scoped to conversation */}
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
        {/* Render conversation view or empty state */}
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
          w-full flex-2 lg:max-w-2/5
          ${activeConversationId ? "hidden lg:block" : ""}
        `}
      >
        {/* Sidebar showing all user conversations. */}
        <ConversationList
          userId={userId}
          activeConversationId={activeConversationId}
          conversations={conversations}
        />
      </aside>
    </main>
  );
}
