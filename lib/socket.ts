// @/lib/socket.ts

import { io, Socket } from "socket.io-client";

let socket: Socket;

if (typeof window !== "undefined") {
  socket = io(process.env.NEXT_PUBLIC_APP_URL!, {
    transports: ["websocket"],
    autoConnect: true,
  });
}

export { socket };