export interface ConversationListItem {
  id: string;

  propertyId: string;
  propertyTitle: string;

  otherUserId: number;
  otherUserName: string;
  otherUserAvatar: string | null;

  lastMessage: string | null;
  lastMessageAt: string | null;

  unreadCount: number;
}

export interface ChatMessage {
  id: string;

  senderId: number;

  message: string;

  seenAt: string | null;

  isDeleted: boolean;

  createdAt: string;
}