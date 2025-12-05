"use client";

import { useState } from "react";
import ChatsCardList from "@/components/pages/profile/chat/chats-card-list";
import ViewConversation from "@/components/pages/profile/chat/view-conversations";
import { cn } from "@/lib/utils";
import { chatslist } from "@/lib/dummyData";

export default function ChatPage() {

  // State to keep track of currently active chat
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  return (
    <main className="flex flex-row h-[calc(100vh-80px)] px-4">

      {/* LEFT: Conversation Details Section */}
      <section className="flex-3 h-full overflow-hidden">

        {/* wrapper*/}
        <div className="h-full flex flex-col gap-4 pr-4 lg:pr-10 py-5 pb-5 overflow-y-auto">
          <ViewConversation selectedChatId={activeChatId} onSelectChat={setActiveChatId} />
        </div>
      </section>

      {/* RIGHT: Chats List Section (Hidden on small screens) */}
      <aside
        className={cn(
          "h-full",
          activeChatId
            ? "hidden lg:block lg:bg-side-panel flex-2"
            : "w-full lg:flex-2 lg:bg-side-panel"
        )}
      >
        {/* wrapper */}
        <div className="p-4 h-full">
          <ChatsCardList chats={chatslist} onSelectChat={setActiveChatId} />
        </div>
      </aside>
    </main>
  );
}
