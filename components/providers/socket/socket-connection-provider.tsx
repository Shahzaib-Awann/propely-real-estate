"use client";

import { socket } from "@/lib/socket/client";
// @/components/providers/socket/socket-connection-provider.tsx

import { useEffect } from "react";

export default function SocketConnectionProvider() {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}