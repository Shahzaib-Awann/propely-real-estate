"use strict";
// @/lib/socket/socket-events.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKET_EVENTS = void 0;
exports.SOCKET_EVENTS = {
    REGISTER_USER: "register-user",
    UNREGISTER_USER: "unregister-user",
    JOIN_CONVERSATION: "join-conversation",
    LEAVE_CONVERSATION: "leave-conversation",
    SEND_MESSAGE: "send-message", // client → server
    NEW_MESSAGE: "new-message", // server → clients
    MESSAGE_SEEN: "message-seen",
    SIDEBAR_UPDATE: "sidebar-update",
};
