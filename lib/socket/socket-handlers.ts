// @/lib/socket/socket-handlers.ts

import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "./socket-events";
import { markConversationAsSeen } from "../actions/chat.action";
import { getConversationRoom, getUserRoom } from "./socket-rooms";

/**
 * Tracks multi-tab connections cleanly.
 * Key: userId string
 * Value: Set of active socket.ids for that specific user
 */
const onlineUsers = new Map<string, Set<string>>();

export function registerSocketHandlers(io: Server, socket: Socket) {

  socket.on(SOCKET_EVENTS.REGISTER_USER, (userId: number) => {
    const userIdStr = String(userId);
    socket.data.userId = userIdStr;
    socket.join(getUserRoom(userId));

    // Multi-tab safe tracking: add this socket instance to the user's connection pool
    if (!onlineUsers.has(userIdStr)) {
      onlineUsers.set(userIdStr, new Set());
    }
    onlineUsers.get(userIdStr)!.add(socket.id);

    // Broadcast only unique online user IDs
    io.emit(SOCKET_EVENTS.ONLINE_PRESENCE, Array.from(onlineUsers.keys()));
    console.log(`${socket.id} registered online for user (${userIdStr})`);
  });

  socket.on(SOCKET_EVENTS.UNREGISTER_USER, (userId: number) => {
    const userIdStr = String(userId);
    socket.leave(getUserRoom(userId));

    // Remove this specific socket connection from the user's pool
    const userConnections = onlineUsers.get(userIdStr);
    if (userConnections) {
      userConnections.delete(socket.id);
      if (userConnections.size === 0) {
        onlineUsers.delete(userIdStr);
      }
    }

    io.emit(SOCKET_EVENTS.ONLINE_PRESENCE, Array.from(onlineUsers.keys()));
    console.log(`${socket.id} un-registered room ${getUserRoom(userId)}`);
  });

  socket.on(SOCKET_EVENTS.TYPING_START, ({ conversationId, userId }: { conversationId: string; userId: number }) => {
    // Optimization: Cache room string to prevent multiple function executions
    const room = getConversationRoom(conversationId);
    socket.to(room).emit(SOCKET_EVENTS.TYPING_START, { conversationId, userId });
  });

  socket.on(SOCKET_EVENTS.TYPING_STOP, ({ conversationId, userId }: { conversationId: string; userId: number }) => {
    const room = getConversationRoom(conversationId);
    socket.to(room).emit(SOCKET_EVENTS.TYPING_STOP, { conversationId, userId });
  });

  socket.on(SOCKET_EVENTS.MESSAGES_DELETED, ({ conversationId, messageIds }: { conversationId: string; messageIds: string[] }) => {
    const room = getConversationRoom(conversationId);
    io.to(room).emit(SOCKET_EVENTS.MESSAGES_DELETED, { conversationId, messageIds });
  });

  socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, (conversationId: string) => {
    const room = getConversationRoom(conversationId);
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);
  });

  socket.on(SOCKET_EVENTS.LEAVE_CONVERSATION, (conversationId: string) => {
    const room = getConversationRoom(conversationId);
    socket.leave(room);
    console.log(`${socket.id} left ${room}`);
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

    io.to(getUserRoom(message.senderId)).emit(SOCKET_EVENTS.SIDEBAR_UPDATE, sidebarPayload);
    io.to(getUserRoom(message.receiverId)).emit(SOCKET_EVENTS.SIDEBAR_UPDATE, sidebarPayload);
  });

  socket.on(SOCKET_EVENTS.MESSAGE_SEEN, async ({ conversationId, viewerId }) => {
    await markConversationAsSeen(conversationId, viewerId);

    const room = getConversationRoom(conversationId);
    io.to(room).emit(SOCKET_EVENTS.MESSAGE_SEEN, { conversationId, viewerId });
  });

  // Safe disconnection handler for multi-tab environments
  socket.on("disconnect", () => {
    const userIdStr = socket.data.userId;
    if (!userIdStr) return;

    const userConnections = onlineUsers.get(userIdStr);
    if (userConnections) {
      userConnections.delete(socket.id);

      // Only delete user entirely and broadcast if ALL tabs/sockets are closed
      if (userConnections.size === 0) {
        onlineUsers.delete(userIdStr);
        io.emit(SOCKET_EVENTS.ONLINE_PRESENCE, Array.from(onlineUsers.keys()));
        console.log(`Disconnected clean: User ${userIdStr} is now offline`);
      } else {
        console.log(`Disconnected single tab: User ${userIdStr} still has active connections`);
      }
    }
  });
}