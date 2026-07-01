export const SOCKET_EVENTS = {

  /**
   * Register a user as "online" in the socket system
   */
  REGISTER_USER: "register-user",

  /**
   * Remove user from online registry
   */
  UNREGISTER_USER: "unregister-user",

  /**
   * Join a specific conversation room for real-time updates
   */
  JOIN_CONVERSATION: "join-conversation",

  /**
   * Leave a conversation room
   */
  LEAVE_CONVERSATION: "leave-conversation",

  /**
   * Client sends a new message to server
   */
  SEND_MESSAGE: "send-message",

  /**
   * Server broadcasts newly created message to connected clients
   */
  NEW_MESSAGE: "new-message",

  /**
   * Notify clients that messages were deleted
   */
  MESSAGES_DELETED: "messages-deleted",

  /**
   * Mark messages as seen in real time
   */
  MESSAGE_SEEN: "message-seen",

  /**
   * Trigger sidebar updates (e.g., last message, unread count)
   */
  SIDEBAR_UPDATE: "sidebar-update",

  /**
   * Broadcast online/offline user presence updates
   */
  ONLINE_PRESENCE: "online-presence",

  /**
   * User started typing in a conversation
   */
  TYPING_START: "typing-start",

  /**
   * User stopped typing in a conversation
   */
  TYPING_STOP: "typing-stop",

} as const;