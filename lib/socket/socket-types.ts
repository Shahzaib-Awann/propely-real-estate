export interface NewMessagePayload {
  id: string;
  conversationId: string;
  senderId: number;
  receiverId: number;
  message: string;
  createdAt: string;
}

export interface MessageSeenPayload {
  conversationId: string;
  viewerId: number;
}

export interface SideBarUpdatePayload {
  conversationId: string;
  lastMessage: string;
  lastMessageAt: string;
  senderId: number;
}
