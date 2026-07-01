import { io } from "socket.io-client";

/**
 * Singleton Socket.IO client instance
 *
 * Configured to use WebSocket transport only for performance,
 * and manual connection control for authentication flow.
 *
 * @config
 * - transports: ["websocket"] → forces WebSocket (no polling fallback)
 * - autoConnect: false → connects only after explicit auth/init
 */
export const socket = io(
  process.env.NEXT_PUBLIC_APP_URL!,
  {
    transports: ["websocket"],
    autoConnect: false,
  }
);