// @/lib/socket/socket-handlers.ts

import { Server, Socket } from "socket.io";

import { SOCKET_EVENTS } from "./socket-events";
import { markConversationAsSeen } from "../actions/chat.action";

import { getConversationRoom, getUserRoom } from "./socket-rooms";

// Keep track of active users
const onlineUsers = new Set<string>();

export function registerSocketHandlers(io: Server, socket: Socket) {
  socket.on(SOCKET_EVENTS.REGISTER_USER, (userId: number) => {
    const userIdStr = String(userId);

    // Store user id on socket
    socket.data.userId = userIdStr;

    socket.join(getUserRoom(userId));

    // Online tracking
    onlineUsers.add(userIdStr);

    // Broadcast updated online users
    io.emit(SOCKET_EVENTS.ONLINE_PRESENCE, Array.from(onlineUsers));

    console.log(`${socket.id} registered as online (${userIdStr})`);
  });

  socket.on(SOCKET_EVENTS.UNREGISTER_USER, (userId: number) => {
    const userIdStr = String(userId);

    socket.leave(getUserRoom(userId));
    onlineUsers.delete(userIdStr);
    io.emit(SOCKET_EVENTS.ONLINE_PRESENCE, Array.from(onlineUsers));

    console.log(`${socket.id} un-registered ${getUserRoom(userId)}`);
  });

  socket.on(SOCKET_EVENTS.TYPING_START, ({ conversationId, userId }: { conversationId: string; userId: number }) => {
  const room = getConversationRoom(conversationId);
  // Broadcast to everyone else in the conversation room
  socket.to(room).emit(SOCKET_EVENTS.TYPING_START, { conversationId, userId });
});

socket.on(SOCKET_EVENTS.TYPING_STOP, ({ conversationId, userId }: { conversationId: string; userId: number }) => {
  const room = getConversationRoom(conversationId);
  socket.to(room).emit(SOCKET_EVENTS.TYPING_STOP, { conversationId, userId });
});

  socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, (conversationId: string) => {
    socket.join(getConversationRoom(conversationId));

    console.log(`${socket.id} joined ${getConversationRoom(conversationId)}`);
  });

  socket.on(SOCKET_EVENTS.LEAVE_CONVERSATION, (conversationId: string) => {
    socket.leave(getConversationRoom(conversationId));

    console.log(`${socket.id} left ${getConversationRoom(conversationId)}`);
  });

  socket.on(SOCKET_EVENTS.SEND_MESSAGE, (message) => {
    const room = getConversationRoom(message.conversationId);

    io.to(room).emit(SOCKET_EVENTS.NEW_MESSAGE, message);

    const sidebarPayload = {
      conversationId: message.conversationId,
      lastMessage: message.message,
      lastMessageAt: message.createdAt,
      senderId: message.senderId,
    };

    io.to(getUserRoom(message.senderId)).emit(
      SOCKET_EVENTS.SIDEBAR_UPDATE,
      sidebarPayload,
    );

    io.to(getUserRoom(message.receiverId)).emit(
      SOCKET_EVENTS.SIDEBAR_UPDATE,
      sidebarPayload,
    );
  });

  socket.on(
    SOCKET_EVENTS.MESSAGE_SEEN,
    async ({ conversationId, viewerId }) => {
      await markConversationAsSeen(conversationId, viewerId);

      io.to(getConversationRoom(conversationId)).emit(
        SOCKET_EVENTS.MESSAGE_SEEN,
        {
          conversationId,
          viewerId,
        },
      );
    },
  );

  // Base disconnection handler
  socket.on("disconnect", () => {
    const userId = socket.data.userId;
    if (userId) {
      onlineUsers.delete(userId);
      io.emit(SOCKET_EVENTS.ONLINE_PRESENCE, Array.from(onlineUsers));
      console.log(`Disconnected clean: ${userId}`);
    }

  });
}
