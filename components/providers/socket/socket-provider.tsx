"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket/client";
import { SOCKET_EVENTS } from "@/lib/socket/socket-events";
import { usePresenceStore } from "@/lib/store/use-presence-store";
import { useChatStore } from "@/lib/store/use-chat-store";
import { SideBarUpdatePayload } from "@/lib/socket/socket-types";

interface SocketProviderProps {
  userId?: number;
}


/**
 * === Global Socket Provider ===
 *
 * This component initializes and manages the application's real-time socket connection.
 * This runs once at the app root level.
 */
export default function SocketProvider({ userId }: SocketProviderProps) {
  useEffect(() => {
    /**
     * Ensure socket connection is active
     */
    if (!socket.connected) {
      socket.connect();
    }

    /**
     * Register user on server for presence tracking
     */
    if (userId) {
      socket.emit(SOCKET_EVENTS.REGISTER_USER, userId);
    }

    /**
     * Handle online users list updates from server
     */
    const handleOnlineUsers = (userIds: string[]) => {
      usePresenceStore.getState().setOnlineUsers(userIds);
    };

    /**
     * Handle sidebar update for unread messages
     */
    const handleSidebarUpdate = (payload: SideBarUpdatePayload) => {
      if (payload.senderId && Number(payload.senderId) !== Number(userId)) {
        useChatStore.getState().updateTotalUnreadCount(1);
      }
    };

    /**
     * Re-register user on socket reconnect
     */
    const handleReconnect = () => {
      if (userId) {
        socket.emit(SOCKET_EVENTS.REGISTER_USER, userId);
      }
    };

    // Register socket listeners
    socket.on(SOCKET_EVENTS.ONLINE_PRESENCE, handleOnlineUsers);
    socket.on(SOCKET_EVENTS.SIDEBAR_UPDATE, handleSidebarUpdate);
    socket.on("connect", handleReconnect);

    return () => {
      // Detach socket listeners
      socket.off(SOCKET_EVENTS.ONLINE_PRESENCE, handleOnlineUsers);
      socket.off(SOCKET_EVENTS.SIDEBAR_UPDATE, handleSidebarUpdate);
      socket.off("connect", handleReconnect);

      if (userId) {
        socket.emit(SOCKET_EVENTS.UNREGISTER_USER, userId);
      }

      socket.disconnect();
    };
  }, [userId]);

  return null;
}