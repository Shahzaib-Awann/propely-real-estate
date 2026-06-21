// @/lib/socket-events.ts

export const SOCKET_EVENTS = {

  JOIN_CONVERSATION: "join-conversation",
  LEAVE_CONVERSATION: "leave-conversation",
  REGISTER_USER: "register-user",
  SEND_MESSAGE: "send-message",
  NEW_MESSAGE: "new-message",
  SIDEBAR_UPDATE: "sidebar-update",
  MESSAGE_SEEN: "message-seen",
} as const;
