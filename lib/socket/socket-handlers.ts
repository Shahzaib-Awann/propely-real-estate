// @/lib/socket/socket-handlers.ts

import { Server, Socket } from "socket.io";

import { SOCKET_EVENTS } from "./socket-events";
import { markConversationAsSeen } from "../actions/chat.action";

import {
  getConversationRoom,
  getUserRoom,
} from "./socket-rooms";

export function registerSocketHandlers(
  io: Server,
  socket: Socket
) {
  socket.on(SOCKET_EVENTS.REGISTER_USER, (userId: number) => {
      socket.join(getUserRoom(userId));
      console.log(`${socket.id} joined ${getUserRoom(userId)}`);
    }
  );

  socket.on(SOCKET_EVENTS.UNREGISTER_USER, (userId: number) => {
    socket.leave(getUserRoom(userId));
    console.log(`${socket.id} left ${getUserRoom(userId)}`);
  });

  socket.on(
    SOCKET_EVENTS.JOIN_CONVERSATION,
    (conversationId: string) => {
      socket.join(
        getConversationRoom(conversationId)
      );

      console.log(
        `${socket.id} joined ${getConversationRoom(
          conversationId
        )}`
      );
    }
  );

  socket.on(
    SOCKET_EVENTS.LEAVE_CONVERSATION,
    (conversationId: string) => {
      socket.leave(
        getConversationRoom(conversationId)
      );

      console.log(
        `${socket.id} left ${getConversationRoom(
          conversationId
        )}`
      );
    }
  );

  socket.on(
    SOCKET_EVENTS.SEND_MESSAGE,
    (message) => {
      const room = getConversationRoom(
        message.conversationId
      );

      io.to(room).emit(
        SOCKET_EVENTS.NEW_MESSAGE,
        message
      );

      const sidebarPayload = {
        conversationId: message.conversationId,
        lastMessage: message.message,
        lastMessageAt: message.createdAt,
      };

      io.to(
        getUserRoom(message.senderId)
      ).emit(
        SOCKET_EVENTS.SIDEBAR_UPDATE,
        sidebarPayload
      );

      io.to(
        getUserRoom(message.receiverId)
      ).emit(
        SOCKET_EVENTS.SIDEBAR_UPDATE,
        sidebarPayload
      );
    }
  );

  socket.on(
    SOCKET_EVENTS.MESSAGE_SEEN,
    async ({
      conversationId,
      viewerId,
    }) => {
      await markConversationAsSeen(conversationId, viewerId);

      io.to(
        getConversationRoom(
          conversationId
        )
      ).emit(
        SOCKET_EVENTS.MESSAGE_SEEN,
        {
          conversationId,
          viewerId,
        }
      );
    }
  );

  socket.on("disconnect", () => {
    console.log(
      "Disconnected:",
      socket.id
    );
  });
}