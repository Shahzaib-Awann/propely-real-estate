// @/lib/socket-events.ts

export const SOCKET_EVENTS = {

  REGISTER_USER: "register-user",
  JOIN_CONVERSATION: "join-conversation",
  LEAVE_CONVERSATION: "leave-conversation",

  SEND_MESSAGE: "send-message",   // client → server
  NEW_MESSAGE: "new-message",     // server → clients

  MESSAGE_SEEN: "message-seen",
  SIDEBAR_UPDATE: "sidebar-update",
} as const;
