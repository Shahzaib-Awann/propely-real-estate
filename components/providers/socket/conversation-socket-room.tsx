"use client";

// @/components/providers/socket/conversation-socket-room.tsx

import { useEffect } from "react";
import { socket } from "@/lib/socket/client";
import { SOCKET_EVENTS } from "@/lib/socket/socket-events";

interface ConversationSocketRoomProps {
  conversationId: string;
}

/**
 * === Conversation Socket Room Provider ===
 *
 * This component is responsible for managing socket room membership
 * for a specific conversation.
 */
export default function ConversationSocketRoom({
  conversationId,
}: ConversationSocketRoomProps) {

  /**
   * Join/leave conversation socket room lifecycle
   */
  useEffect(() => {

    // Join conversation room for real-time updates
    socket.emit(
      SOCKET_EVENTS.JOIN_CONVERSATION,
      conversationId
    );

    return () => {

      // Leave conversation room on cleanup
      socket.emit(
        SOCKET_EVENTS.LEAVE_CONVERSATION,
        conversationId
      );
    };
  }, [conversationId]);

  return null;
}