"use client";

// @/lib/conversation-room.tsx

import { useEffect } from "react";
import { socket } from "./socket";

interface Props {
  conversationId: string;
}

export default function ConversationRoom({
  conversationId,
}: Props) {

  useEffect(() => {
    socket.emit("join-conversation", conversationId);

    return () => {
      socket.emit("leave-conversation", conversationId);
    };
  }, [conversationId]);

  return null;
}