import "dotenv/config";

// @/server.ts

import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

import { registerSocketHandlers } from "./lib/socket/socket-handlers";

const dev =
  process.env.NODE_ENV !== "production";

const app = next({ dev });

const handler =
  app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(
    (req, res) => handler(req, res)
  );

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(
      "Connected:",
      socket.id
    );

    registerSocketHandlers(
      io,
      socket
    );
  });

  httpServer.listen(3000, () => {
    console.log(
      "Server running on port 3000"
    );
  });
});