import { io } from "socket.io-client";

// @/lib/socket/client.ts

export const socket = io(
  process.env.NEXT_PUBLIC_APP_URL!,
  {
    transports: ["websocket"],
    autoConnect: false,
  }
);