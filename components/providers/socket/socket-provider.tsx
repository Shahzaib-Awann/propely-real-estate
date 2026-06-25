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

export default function SocketProvider({ userId }: SocketProviderProps) {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    if (userId) {
      socket.emit(SOCKET_EVENTS.REGISTER_USER, userId);
    }

    const handleOnlineUsers = (userIds: string[]) => {
      usePresenceStore.getState().setOnlineUsers(userIds);
    };

    // 1. Listen for sidebar messages to increment total counter
    const handleSidebarUpdate = (payload: SideBarUpdatePayload) => {
      if (payload.senderId && Number(payload.senderId) !== Number(userId)) {
        useChatStore.getState().updateTotalUnreadCount(1);
      }
    };
    socket.on(SOCKET_EVENTS.SIDEBAR_UPDATE, handleSidebarUpdate);

    // Listen to real-time events safely
    socket.on(SOCKET_EVENTS.ONLINE_PRESENCE, handleOnlineUsers);

    // Handle automatic re-connection synchronization
    const handleReconnect = () => {
      if (userId) {
        socket.emit(SOCKET_EVENTS.REGISTER_USER, userId);
      }
    };
    socket.on("connect", handleReconnect);

    // Cleanup hook layout
    return () => {
      socket.off(SOCKET_EVENTS.ONLINE_PRESENCE, handleOnlineUsers);
      socket.off(SOCKET_EVENTS.SIDEBAR_UPDATE, handleSidebarUpdate);
      socket.off("connect", handleReconnect);

      if (userId) {
        // We tell the server we are leaving right BEFORE shutting down the network stream
        socket.emit(SOCKET_EVENTS.UNREGISTER_USER, userId);
      }

      socket.disconnect();
    };
  }, [userId]);

  return null;
}