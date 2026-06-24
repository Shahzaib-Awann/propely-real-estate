import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import { SOCKET_EVENTS } from "./lib/socket-events";
import { markConversationAsSeen } from "./lib/actions/chat.action";


const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => handler(req, res));

  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on(SOCKET_EVENTS.REGISTER_USER, (userId: number) => {
      socket.join(`user-${userId}`);
      console.log(`${socket.id} joined user-${userId}`);
    });

    socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, (conversationId: string) => {
      socket.join(`conversation-${conversationId}`);
      console.log(`${socket.id} joined conversation-${conversationId}`);
    });

    socket.on(SOCKET_EVENTS.LEAVE_CONVERSATION, (conversationId: string) => {
      socket.leave(`conversation-${conversationId}`);
      console.log(`${socket.id} left conversation-${conversationId}`);
    });

    socket.on(SOCKET_EVENTS.SEND_MESSAGE, (message) => {
      const room = `conversation-${message.conversationId}`;

      io.to(room).emit(SOCKET_EVENTS.NEW_MESSAGE, message);

      // sidebar update for sender + receiver
  const sidebarPayload = {
  conversationId: message.conversationId,
  lastMessage: message.message,
  lastMessageAt: message.createdAt,
};

io.to(`user-${message.senderId}`).emit(
  SOCKET_EVENTS.SIDEBAR_UPDATE,
  sidebarPayload
);

io.to(`user-${message.receiverId}`).emit(
  SOCKET_EVENTS.SIDEBAR_UPDATE,
  sidebarPayload
);

    });

    socket.on(SOCKET_EVENTS.MESSAGE_SEEN, async ({ conversationId, viewerId }) => {
  await markConversationAsSeen({
    conversationId,
    viewerId,
  });

  // notify ALL participants (including sender)
  io.to(`conversation-${conversationId}`).emit(
    SOCKET_EVENTS.MESSAGE_SEEN,
    {
      conversationId,
      viewerId,
    }
  );
});

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });

  httpServer.listen(3000, () => {
    console.log("Server running");
  });
});
