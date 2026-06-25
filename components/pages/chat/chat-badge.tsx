"use client";

import { useChatStore } from "@/lib/store/use-chat-store";
import { MessageCircleMore } from "lucide-react";
import { useEffect } from "react";

interface ChatBadgeProps {
  initialCount: number;
}

export default function ChatBadge({ initialCount }: ChatBadgeProps) {
  const totalUnreadCount = useChatStore((state) => state.totalUnreadCount);
  const setTotalUnreadCount = useChatStore((state) => state.setTotalUnreadCount);

  // Initialize the client state from the server component data
  useEffect(() => {
    setTotalUnreadCount(initialCount);
  }, [initialCount, setTotalUnreadCount]);

  if (totalUnreadCount === 0) {
    return (
      <>
        <MessageCircleMore className="md:hidden block" />
        <span className="hidden md:block">Chats</span>
      </>
    );
  }

  return (
    <>
      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs shadow-sm animate-in zoom-in duration-200">
        {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
      </span>
      <MessageCircleMore className="md:hidden block" />
      <span className="hidden md:block">Chats</span>
    </>
  );
}