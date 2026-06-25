"use strict";
// @/lib/socket/socket-rooms.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationRoom = exports.getUserRoom = void 0;
const getUserRoom = (userId) => {
    return `user-${userId}`;
};
exports.getUserRoom = getUserRoom;
const getConversationRoom = (conversationId) => {
    return `conversation-${conversationId}`;
};
exports.getConversationRoom = getConversationRoom;
