"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket/client";
import { SOCKET_EVENTS } from "@/lib/socket/socket-events";

interface SocketProviderProps {
  userId?: number;
}

export default function SocketProvider({ userId }: SocketProviderProps) {
  useEffect(() => {
    // 1. Establish core connection
    if (!socket.connected) {
      socket.connect();
    }

    // 2. If user is logged in, register them
    if (userId) {
      socket.emit(SOCKET_EVENTS.REGISTER_USER, userId);
    }

    // Cleanup on unmount
    return () => {
      if (userId) {
        socket.emit(SOCKET_EVENTS.UNREGISTER_USER, userId);
      }
      socket.disconnect();
    };
  }, [userId]); // Re-runs cleanly if the user logs in or out

  return null;
}