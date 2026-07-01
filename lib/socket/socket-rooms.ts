/**
 * === Get User Room ===
 *
 * Creates a unique socket room for a user.
 * Used for personal events like notifications, sidebar updates,
 * and online presence tracking.
 *
 * @param userId - User ID.
 *
 * @returns User-specific socket room string.
 */
export const getUserRoom = (userId: number) => {
  return `user-${userId}`;
};



/**
 * === Get Conversation Room ===
 *
 * Creates a unique socket room for each conversation.
 * Used for real-time message exchange within a chat.
 *
 * @param conversationId - Conversation ID.
 *
 * @returns Conversation-specific socket room string.
 */
export const getConversationRoom = (
  conversationId: string
) => {
  return `conversation-${conversationId}`;
};
