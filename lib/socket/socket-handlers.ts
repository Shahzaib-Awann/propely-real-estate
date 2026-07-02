import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "./socket-events";
import { markConversationAsSeen } from "../actions/chat.action";
import { getConversationRoom, getUserRoom } from "./socket-rooms";

/**
 * Tracks multi-tab connections cleanly.
 *
 * Map structure:
 * - key: userId (string)
 * - value: Set of socket IDs belonging to that user
 */
const onlineUsers = new Map<string, Set<string>>();

/**
 * === Register Socket Event Handlers ===
 *
 * Attaches all event listeners to a connected socket instance.
 *
 * @param io - Socket.IO server instance used for broadcasting events
 * @param socket - Individual client socket connection
 */
export function registerSocketHandlers(io: Server, socket: Socket) {
  /**
   * === USER REGISTRATION (ONLINE TRACKING) ===
   *
   * Marks a user as online and tracks their socket connection.
   */
  socket.on(SOCKET_EVENTS.REGISTER_USER, (userId: number) => {
    const userIdStr = String(userId);

    // Store user ID in socket context for later cleanup
    socket.data.userId = userIdStr;

    // Join a personal room for user-specific broadcasts
    socket.join(getUserRoom(userId));

    // Initialize connection set if first time
    if (!onlineUsers.has(userIdStr)) {
      onlineUsers.set(userIdStr, new Set());
    }

    // Track this socket connection
    onlineUsers.get(userIdStr)!.add(socket.id);

    // Broadcast updated online users list to all clients
    io.emit(SOCKET_EVENTS.ONLINE_PRESENCE, Array.from(onlineUsers.keys()));
  });

  /**
   * === USER UNREGISTER (MANUAL OFFLINE) ===
   *
   * Removes a socket from active tracking for a user.
   */
  socket.on(SOCKET_EVENTS.UNREGISTER_USER, (userId: number) => {
    const userIdStr = String(userId);
    socket.leave(getUserRoom(userId));

    const userConnections = onlineUsers.get(userIdStr);
    if (userConnections) {
      userConnections.delete(socket.id);

      // Remove user entirely if no active tabs remain
      if (userConnections.size === 0) {
        onlineUsers.delete(userIdStr);
      }
    }

    io.emit(SOCKET_EVENTS.ONLINE_PRESENCE, Array.from(onlineUsers.keys()));
  });

  /**
   * === TYPING START EVENT ===
   *
   * Broadcasts when a user starts typing in a conversation.
   */
  socket.on(
    SOCKET_EVENTS.TYPING_START,
    ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: number;
    }) => {
      socket.data.typingRoom = conversationId;
      const room = getConversationRoom(conversationId);
      socket
        .to(room)
        .emit(SOCKET_EVENTS.TYPING_START, { conversationId, userId });
    },
  );

  /**
   * === TYPING STOP EVENT ===
   *
   * Broadcasts when a user stops typing.
   */
  socket.on(
    SOCKET_EVENTS.TYPING_STOP,
    ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: number;
    }) => {
      socket.data.typingRoom = null;
      const room = getConversationRoom(conversationId);
      socket
        .to(room)
        .emit(SOCKET_EVENTS.TYPING_STOP, { conversationId, userId });
    },
  );

  /**
   * === MESSAGE DELETION EVENT ===
   *
   * Broadcasts deleted messages to all users in the conversation.
   */
  socket.on(
    SOCKET_EVENTS.MESSAGES_DELETED,
    ({
      conversationId,
      messageIds,
    }: {
      conversationId: string;
      messageIds: string[];
    }) => {
      const room = getConversationRoom(conversationId);
      io.to(room).emit(SOCKET_EVENTS.MESSAGES_DELETED, {
        conversationId,
        messageIds,
      });
    },
  );

  /**
   * === JOIN CONVERSATION ROOM ===
   *
   * Adds socket to a conversation room for real-time messaging.
   */
  socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, (conversationId: string) => {
    const room = getConversationRoom(conversationId);
    socket.join(room);
  });

  /**
   * === LEAVE CONVERSATION ROOM ===
   *
   * Removes socket from a conversation room.
   */
  socket.on(SOCKET_EVENTS.LEAVE_CONVERSATION, (conversationId: string) => {
    const room = getConversationRoom(conversationId);
    socket.leave(room);
  });

  /**
   * === SEND MESSAGE EVENT ===
   *
   * Receives message from sender and broadcasts it to:
   * - Conversation room (for chat UI)
   * - Sender sidebar (update preview)
   * - Receiver sidebar (update preview + unread state)
   */
  socket.on(SOCKET_EVENTS.SEND_MESSAGE, (message) => {
    const room = getConversationRoom(message.conversationId);

    // Broadcast new message to all participants in conversation
    io.to(room).emit(SOCKET_EVENTS.NEW_MESSAGE, message);

    const sidebarPayload = {
      conversationId: message.conversationId,
      lastMessage: message.message,
      lastMessageAt: message.createdAt,
      senderId: message.senderId,
    };

    // Update sender sidebar UI
    io.to(getUserRoom(message.senderId)).emit(
      SOCKET_EVENTS.SIDEBAR_UPDATE,
      sidebarPayload,
    );

    // Update receiver sidebar UI
    io.to(getUserRoom(message.receiverId)).emit(
      SOCKET_EVENTS.SIDEBAR_UPDATE,
      sidebarPayload,
    );
  });

  /**
   * === MESSAGE SEEN EVENT ===
   *
   * Marks messages as seen and notifies all participants.
   */
  socket.on(
    SOCKET_EVENTS.MESSAGE_SEEN,
    async ({ conversationId, viewerId }) => {
      await markConversationAsSeen(conversationId, viewerId);

      const room = getConversationRoom(conversationId);
      io.to(room).emit(SOCKET_EVENTS.MESSAGE_SEEN, {
        conversationId,
        viewerId,
      });
    },
  );

  /**
   * === DISCONNECT HANDLER ===
   *
   * Cleans up:
   * - User presence tracking
   * - Typing indicators (if abrupt disconnect)
   * - Multi-tab connection state
   */
  socket.on("disconnect", () => {
    const userIdStr = socket.data.userId;
    const typingRoom = socket.data.typingRoom;

    /**
     * If user was typing and disconnects unexpectedly,
     * notify conversation so UI can clear typing indicator.
     */
    if (typingRoom && userIdStr) {
      const room = getConversationRoom(typingRoom);
      socket.to(room).emit(SOCKET_EVENTS.TYPING_STOP, {
        conversationId: typingRoom,
        userId: Number(userIdStr),
      });
    }

    if (!userIdStr) return;

    const userConnections = onlineUsers.get(userIdStr);

    if (userConnections) {
      userConnections.delete(socket.id);

      // If no more active sockets exist, mark user offline
      if (userConnections.size === 0) {
        onlineUsers.delete(userIdStr);
        io.emit(SOCKET_EVENTS.ONLINE_PRESENCE, Array.from(onlineUsers.keys()));
      }
    }
  });
}
