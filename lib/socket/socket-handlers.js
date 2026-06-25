"use strict";
// @/lib/socket/socket-handlers.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSocketHandlers = registerSocketHandlers;
const socket_events_1 = require("./socket-events");
const chat_action_1 = require("../actions/chat.action");
const socket_rooms_1 = require("./socket-rooms");
function registerSocketHandlers(io, socket) {
    socket.on(socket_events_1.SOCKET_EVENTS.REGISTER_USER, (userId) => {
        socket.join((0, socket_rooms_1.getUserRoom)(userId));
        console.log(`${socket.id} joined ${(0, socket_rooms_1.getUserRoom)(userId)}`);
    });
    socket.on(socket_events_1.SOCKET_EVENTS.UNREGISTER_USER, (userId) => {
        socket.leave((0, socket_rooms_1.getUserRoom)(userId));
        console.log(`${socket.id} left ${(0, socket_rooms_1.getUserRoom)(userId)}`);
    });
    socket.on(socket_events_1.SOCKET_EVENTS.JOIN_CONVERSATION, (conversationId) => {
        socket.join((0, socket_rooms_1.getConversationRoom)(conversationId));
        console.log(`${socket.id} joined ${(0, socket_rooms_1.getConversationRoom)(conversationId)}`);
    });
    socket.on(socket_events_1.SOCKET_EVENTS.LEAVE_CONVERSATION, (conversationId) => {
        socket.leave((0, socket_rooms_1.getConversationRoom)(conversationId));
        console.log(`${socket.id} left ${(0, socket_rooms_1.getConversationRoom)(conversationId)}`);
    });
    socket.on(socket_events_1.SOCKET_EVENTS.SEND_MESSAGE, (message) => {
        const room = (0, socket_rooms_1.getConversationRoom)(message.conversationId);
        io.to(room).emit(socket_events_1.SOCKET_EVENTS.NEW_MESSAGE, message);
        const sidebarPayload = {
            conversationId: message.conversationId,
            lastMessage: message.message,
            lastMessageAt: message.createdAt,
        };
        io.to((0, socket_rooms_1.getUserRoom)(message.senderId)).emit(socket_events_1.SOCKET_EVENTS.SIDEBAR_UPDATE, sidebarPayload);
        io.to((0, socket_rooms_1.getUserRoom)(message.receiverId)).emit(socket_events_1.SOCKET_EVENTS.SIDEBAR_UPDATE, sidebarPayload);
    });
    socket.on(socket_events_1.SOCKET_EVENTS.MESSAGE_SEEN, async ({ conversationId, viewerId, }) => {
        await (0, chat_action_1.markConversationAsSeen)(conversationId, viewerId);
        io.to((0, socket_rooms_1.getConversationRoom)(conversationId)).emit(socket_events_1.SOCKET_EVENTS.MESSAGE_SEEN, {
            conversationId,
            viewerId,
        });
    });
    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
    });
}
