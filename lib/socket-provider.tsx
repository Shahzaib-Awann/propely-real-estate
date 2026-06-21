"use client";

// @/lib/socket-provider.tsx

import { useEffect } from "react";
import { socket } from "./socket";

export default function SocketProvider() {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}