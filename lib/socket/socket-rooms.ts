// @/lib/socket/socket-rooms.ts

export const getUserRoom = (userId: number) => {
  return `user-${userId}`;
};

export const getConversationRoom = (
  conversationId: string
) => {
  return `conversation-${conversationId}`;
};