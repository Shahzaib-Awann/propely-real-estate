"use client";

import ConversationList from "@/components/pages/chat/conversation-list";
import ConversationView from "@/components/pages/chat/conversation-view";
import EmptyState from "@/components/pages/chat/empty-state";

interface ChatClientProps {
  activeConversationId?: string;
}

export default function ChatClient({
  activeConversationId,
}: ChatClientProps) {
  return (
    <main className="h-[calc(100vh-80px)] flex">

      {/* Left Sidebar */}
      <aside
        className={`
          border-r bg-background
          w-full lg:w-[380px]
          ${activeConversationId ? "hidden lg:block" : ""}
        `}
      >
        <ConversationList />
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
          />
        ) : (
          <EmptyState />
        )}
      </section>
    </main>
  );
}