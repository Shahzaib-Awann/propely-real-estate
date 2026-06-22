"use client";

// @/lib/conversation-room.tsx

import { useEffect } from "react";
import { socket } from "./socket";
import { SOCKET_EVENTS } from "./socket-events";

interface Props {
  conversationId: string;
}

export default function ConversationRoom({
  conversationId,
}: Props) {

  useEffect(() => {
    socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, conversationId);

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, conversationId);
    };
  }, [conversationId]);

  return null;
}