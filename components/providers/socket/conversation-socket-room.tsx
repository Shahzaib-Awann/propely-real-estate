"use client";

// @/components/providers/socket/conversation-socket-room.tsx

import { useEffect } from "react";
import { socket } from "@/lib/socket/client";
import { SOCKET_EVENTS } from "@/lib/socket/socket-events";

interface ConversationSocketRoomProps {
  conversationId: string;
}

export default function ConversationSocketRoom({
  conversationId,
}: ConversationSocketRoomProps) {
  useEffect(() => {
    socket.emit(
      SOCKET_EVENTS.JOIN_CONVERSATION,
      conversationId
    );

    return () => {
      socket.emit(
        SOCKET_EVENTS.LEAVE_CONVERSATION,
        conversationId
      );
    };
  }, [conversationId]);

  return null;
}