"use server";

import { and, desc, eq, inArray, isNull, lt, ne, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";
import { v6 as uuidv6 } from "uuid";

import { db } from "../db/connection";
import {
  conversationsTable,
  postsTable,
  usersTable,
  messagesTable,
} from "../db/schema";

import {
  ConversationHeader,
  ConversationListItem,
  RealtimeMessage,
} from "@/types/propely.chat";

/**
 * Helper to generate a clean MySQL-compatible timestamp string: YYYY-MM-DD HH:MM:SS
 */
function getMysqlTimestamp(): string {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

/**
 * === Get User Conversations ===
 *
 * Fetches a list of all conversations where the user is either a buyer or seller.
 * This function is used to power the chat sidebar list in the UI.
 *
 * @param userId - The ID of the authenticated user whose conversations are being fetched
 * @throws DATABASE_ERROR - If the database query fails (e.g. connection or SQL error)
 * @returns Array of conversation list items ordered by most recent activity
 */
export async function getUserConversations(
  userId: number,
): Promise<ConversationListItem[]> {
  // Create table aliases for the users table.
  const buyer = alias(usersTable, "buyer");
  const seller = alias(usersTable, "seller");

  // Fetch all conversations for a given user.
  const rows = await db
    .select({
      id: conversationsTable.id,

      propertyId: conversationsTable.postId,

      propertyTitle: sql<string>`
        COALESCE(${postsTable.title}, 'Unknown Property')
      `,

      otherUserId: sql<number>`
        CASE
          WHEN ${conversationsTable.buyerId} = ${userId}
          THEN ${conversationsTable.sellerId}
          ELSE ${conversationsTable.buyerId}
        END
      `,

      otherUserName: sql<string>`
        CASE
          WHEN ${conversationsTable.buyerId} = ${userId}
          THEN ${seller.name}
          ELSE ${buyer.name}
        END
      `,

      otherUserAvatar: sql<string | null>`
        CASE
          WHEN ${conversationsTable.buyerId} = ${userId}
          THEN ${seller.avatar}
          ELSE ${buyer.avatar}
        END
      `,

      lastMessage: conversationsTable.lastMessage,
      lastMessageAt: conversationsTable.lastMessageAt,

      unreadCount: sql<number>`
        (
          SELECT COUNT(*)
          FROM ${messagesTable}
          WHERE
            ${messagesTable.conversationId} = ${conversationsTable.id}
            AND ${messagesTable.senderId} != ${userId}
            AND ${messagesTable.seenAt} IS NULL
            AND ${messagesTable.isDeleted} = 0
        )
      `,
    })
    .from(conversationsTable)
    .leftJoin(postsTable, eq(postsTable.id, conversationsTable.postId))
    .leftJoin(buyer, eq(buyer.id, conversationsTable.buyerId))
    .leftJoin(seller, eq(seller.id, conversationsTable.sellerId))
    .where(
      or(
        eq(conversationsTable.buyerId, userId),
        eq(conversationsTable.sellerId, userId),
      ),
    )
    .orderBy(desc(conversationsTable.lastMessageAt));

  // Return formatted conversation list for UI rendering
  return rows;
}



/**
 * === Get Total Unread Messages ===
 *
 * Counts unread messages for a user either globally (all conversations)
 * or within a single conversation.
 *
 * This function is used for:
 * - Showing unread badge counts in UI
 * - Updating notification indicators in real time
 *
 * @param userId - The authenticated user ID whose unread messages are being counted
 * @param conversationId - Optional conversation ID (used when scope is "single")
 * @param scope - Determines whether to count: ("all" → all conversations | "single" → one specific conversation)
 * @throws DATABASE_ERROR - If query execution fails
 * @returns Total number of unread messages as a numeric value
 */
export async function getTotalUnreadMessages({
  userId,
  conversationId,
  scope,
}: {
  userId: number;
  conversationId?: string;
  scope: "all" | "single";
}): Promise<number> {
  // 1. Build core base conditions
  const conditions = [
    or(
      eq(conversationsTable.buyerId, userId),
      eq(conversationsTable.sellerId, userId),
    ),
    ne(messagesTable.senderId, userId),
    isNull(messagesTable.seenAt),
  ];

  // 2. If scope is 'single' and a conversationId is provided, narrow the search
  if (scope === "single" && conversationId) {
    conditions.push(eq(messagesTable.conversationId, conversationId));
  }

  // Execute aggregate query to count unread messages
  const result = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(messagesTable)
    .innerJoin(
      conversationsTable,
      eq(messagesTable.conversationId, conversationsTable.id),
    )
    .where(and(...conditions));

  // Return safe numeric count (defaults to 0 if no result found)
  return Number(result[0]?.count ?? 0);
}



/**
 * === Create or Get Conversation ===
 *
 * Creates a new conversation between a buyer and a property seller,
 * or returns an existing one if it already exists.
 *
 * Ensures the property exists, prevents self-chat,
 * and avoids duplicate conversations. Runs inside a DB transaction.
 *
 * @param buyerId - ID of the buyer initiating the conversation.
 * @param postId - ID of the property/post.
 *
 * @throws Error "Property not found" - If the post does not exist.
 * @throws Error "You cannot start a conversation with yourself" - If buyer is the seller.
 * @throws DATABASE_ERROR - If transaction or query fails.
 *
 * @returns Object with conversationId and isNew flag.
 */
export async function createOrGetConversation({
  buyerId,
  postId,
}: {
  buyerId: number;
  postId: string;
}): Promise<{
  conversationId: string;
  isNew: boolean;
}> {
  return db.transaction(async (tx) => {
    // Find property
    const [property] = await tx
      .select({
        sellerId: postsTable.sellerId,
      })
      .from(postsTable)
      .where(eq(postsTable.id, postId));

    if (!property) {
      throw new Error("Property not found");
    }

    // Prevent self-chat
    if (property.sellerId === buyerId) {
      throw new Error("You cannot start a conversation with yourself");
    }

    // Check existing conversation
    const [existingConversation] = await tx
      .select({
        id: conversationsTable.id,
      })
      .from(conversationsTable)
      .where(
        and(
          eq(conversationsTable.postId, postId),
          eq(conversationsTable.buyerId, buyerId),
          eq(conversationsTable.sellerId, property.sellerId),
        ),
      );

    // If conversation exists, return it instead of creating a new one
    if (existingConversation) {
      return {
        conversationId: existingConversation.id,
        isNew: false,
      };
    }

    // Create conversation
    const conversationId = uuidv6();

    await tx.insert(conversationsTable).values({
      id: conversationId,
      postId,
      buyerId,
      sellerId: property.sellerId,
    });

    // Return newly created conversation details
    return {
      conversationId,
      isNew: true,
    };
  });
}



/**
 * === Get Conversation By ID ===
 *
 * Fetches a conversation by ID for a specific user.
 * Verifies the user is part of the conversation before returning data.
 *
 * Returns a structured header with property details
 * and the other participant (buyer/seller), determined dynamically.
 *
 * @param conversationId - ID of the conversation.
 * @param userId - ID of the requesting user.
 *
 * @throws DATABASE_ERROR - If query fails.
 *
 * @returns ConversationHeader if found, otherwise null.
 */
export async function getConversationById(
  conversationId: string,
  userId: number,
): Promise<ConversationHeader | null> {
  // Fetch conversation details along with related property and user info.
  const result = await db
    .select({
      id: conversationsTable.id,

      propertyId: postsTable.id,
      propertyTitle: postsTable.title,

      buyerId: conversationsTable.buyerId,
      sellerId: conversationsTable.sellerId,

      otherUserId: usersTable.id,
      otherUserName: usersTable.name,
      otherUserAvatar: usersTable.avatar,
    })
    .from(conversationsTable)
    .innerJoin(postsTable, eq(postsTable.id, conversationsTable.postId))
    .innerJoin(
      usersTable,
      sql`
        ${usersTable.id} =
        CASE
          WHEN ${conversationsTable.buyerId} = ${userId}
          THEN ${conversationsTable.sellerId}
          ELSE ${conversationsTable.buyerId}
        END
      `,
    )
    .where(
      and(
        eq(conversationsTable.id, conversationId),
        or(
          eq(conversationsTable.buyerId, userId),
          eq(conversationsTable.sellerId, userId),
        ),
      ),
    )
    .limit(1);

  const conversation = result[0];

  // If no conversation found or user has no access, return null
  if (!conversation) {
    return null;
  }

  // Format and return the conversation header
  return {
    id: conversation.id,
    property: {
      id: conversation.propertyId,
      title: conversation.propertyTitle,
    },
    otherUser: {
      id: conversation.otherUserId,
      name: conversation.otherUserName,
      avatar: conversation.otherUserAvatar,
    },
  };
}



/**
 * === Get Conversation Messages ===
 *
 * Fetches paginated messages for a conversation using cursor-based pagination
 * (for infinite scroll chat history).
 *
 * Messages are loaded newest-first, then reversed for UI-friendly order.
 * Each message is enriched with receiver ID, role metadata, and safe content.
 *
 * @param conversationId - ID of the conversation.
 * @param cursor - Timestamp of the last loaded message.
 * @param limit - Number of messages to fetch (default: 30).
 *
 * @throws DATABASE_ERROR - If query fails.
 *
 * @returns Chronologically ordered message array (oldest → newest).
 */
export async function getConversationMessages({
  conversationId,
  cursor,
  limit = 30,
}: {
  conversationId: string;
  cursor?: string | null;
  limit?: number;
}): Promise<RealtimeMessage[]> {
  // Build query conditions
  const conditions = [eq(messagesTable.conversationId, conversationId)];

  // If a cursor is passed, only fetch messages older than this timestamp
  if (cursor) {
    conditions.push(lt(messagesTable.createdAt, cursor));
  }

  // Fetch messages along with conversation metadata (buyer/seller IDs)
  const messages = await db
    .select({
      id: messagesTable.id,
      conversationId: messagesTable.conversationId,
      senderId: messagesTable.senderId,
      message: messagesTable.message,
      seenAt: messagesTable.seenAt,
      isDeleted: messagesTable.isDeleted,
      createdAt: messagesTable.createdAt,
      buyerId: conversationsTable.buyerId,
      sellerId: conversationsTable.sellerId,
    })
    .from(messagesTable)
    .innerJoin(
      conversationsTable,
      eq(messagesTable.conversationId, conversationsTable.id),
    )
    .where(and(...conditions))
    .orderBy(desc(messagesTable.createdAt)) // Fetch latest entries first relative to cursor
    .limit(limit);

  // Reverse messages to restore chronological order (oldest → newest)
  return messages.reverse().map((msg) => ({
    id: msg.id,
    conversationId: msg.conversationId,
    senderId: msg.senderId,
    receiverId: msg.senderId === msg.buyerId ? msg.sellerId : msg.buyerId,
    buyerId: msg.buyerId,
    sellerId: msg.sellerId,
    message: msg.isDeleted ? "This message was deleted" : msg.message,
    seenAt: msg.seenAt,
    isDeleted: msg.isDeleted,
    createdAt: msg.createdAt,
  }));
}



/**
 * === Send Message ===
 *
 * Sends a message in an existing conversation.
 * Validates sender participation, creates the message,
 * and updates conversation metadata (last message).
 *
 * Runs inside a DB transaction to keep data consistent.
 *
 * @param conversationId - ID of the conversation.
 * @param senderId - ID of the sending user.
 * @param message - Message text content.
 *
 * @throws DATABASE_ERROR - If query/transaction fails.
 *
 * @returns Newly created message with receiverId, or null if invalid.
 */
export async function sendMessage({
  conversationId,
  senderId,
  message,
}: {
  conversationId: string;
  senderId: number;
  message: string;
}) {
  // Validate sender
  const [sender] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.id, senderId));

  if (!sender) {
    return null;
  }

  // Validate conversation + membership
  const [conversation] = await db
    .select({ id: conversationsTable.id })
    .from(conversationsTable)
    .where(
      and(
        eq(conversationsTable.id, conversationId),
        or(
          eq(conversationsTable.buyerId, senderId),
          eq(conversationsTable.sellerId, senderId),
        ),
      ),
    );

  // If conversation is invalid or user is not part of it, abort
  if (!conversation) {
    return null;
  }

  // Execute transactional message creation and updates
  return await db.transaction(async (tx) => {
    const messageId = uuidv6();

    // Insert new message into messages table
    await tx.insert(messagesTable).values({
      id: messageId,
      conversationId,
      senderId,
      message,
    });

    const now = getMysqlTimestamp();

    // Update conversation with latest message info
    await tx
      .update(conversationsTable)
      .set({
        lastMessage: message,
        lastMessageAt: now,
      })
      .where(eq(conversationsTable.id, conversationId));

    // Fetch the newly created message with conversation context
    const [createdMessage] = await tx
      .select({
        id: messagesTable.id,
        conversationId: messagesTable.conversationId,
        senderId: messagesTable.senderId,

        buyerId: conversationsTable.buyerId,
        sellerId: conversationsTable.sellerId,

        message: messagesTable.message,
        seenAt: messagesTable.seenAt,
        isDeleted: messagesTable.isDeleted,
        createdAt: messagesTable.createdAt,
      })
      .from(messagesTable)
      .innerJoin(
        conversationsTable,
        eq(messagesTable.conversationId, conversationsTable.id),
      )
      .where(eq(messagesTable.id, messageId));

    // Determine receiver dynamically based on sender role
    const receiverId =
      createdMessage.senderId === createdMessage.buyerId
        ? createdMessage.sellerId
        : createdMessage.buyerId;

    // Return final normalized message object for realtime UI updates
    return {
      ...createdMessage,
      receiverId,
    };
  });
}



/**
 * === Mark Conversation As Seen ===
 *
 * Marks all unread messages in a conversation as seen for a user.
 * Validates access and updates incoming messages with a seen timestamp.
 *
 * Typically triggered when a user opens the chat.
 *
 * @param conversationId - ID of the conversation.
 * @param viewerId - ID of the user viewing the conversation.
 *
 * @throws DATABASE_ERROR - If update fails.
 *
 * @returns Success flag object, or null if access is invalid.
 */
export async function markConversationAsSeen(
  conversationId: string,
  viewerId: number,
) {
  // Validate conversation + access
  const [conversation] = await db
    .select({
      id: conversationsTable.id,
      buyerId: conversationsTable.buyerId,
      sellerId: conversationsTable.sellerId,
    })
    .from(conversationsTable)
    .where(eq(conversationsTable.id, conversationId));

  if (!conversation) return null;

  // Ensure the viewer is part of this conversation
  const isParticipant =
    conversation.buyerId === viewerId || conversation.sellerId === viewerId;

  if (!isParticipant) return null;

  const now = getMysqlTimestamp();

  // Mark all incoming messages as seen
  await db
    .update(messagesTable)
    .set({
      seenAt: now,
    })
    .where(
      and(
        eq(messagesTable.conversationId, conversationId),
        ne(messagesTable.senderId, viewerId),
        isNull(messagesTable.seenAt),
      ),
    );

  return { success: true };
}



/**
 * === Delete Messages ===
 *
 * Soft-deletes selected messages in a conversation.
 * Only allows deletion of messages sent by the requesting user.
 * Stores deletion timestamp instead of permanently removing data.
 *
 * Used for "delete for me" chat behavior.
 *
 * @param messageIds - Array of message IDs to delete.
 * @param userId - ID of the requesting user.
 * @param conversationId - ID of the conversation.
 *
 * @throws DATABASE_ERROR - If update fails.
 *
 * @returns Success status with deleted message IDs, or error info.
 */
export async function deleteMessages({
  messageIds,
  userId,
  conversationId,
}: {
  messageIds: string[];
  userId: number;
  conversationId: string;
}) {
  try {
    // Validate that at least one message is selected for deletion
    if (!messageIds.length)
      return { success: false, error: "No messages selected" };

    const now = getMysqlTimestamp();

    // Soft delete messages in DB: Only allow deleting your own messages in this conversation
    await db
      .update(messagesTable)
      .set({
        isDeleted: true,
        deletedAt: now,
      })
      .where(
        and(
          eq(messagesTable.conversationId, conversationId),
          eq(messagesTable.senderId, userId),
          inArray(messagesTable.id, messageIds),
        ),
      );

    // Return success response with affected message IDs
    return { success: true, messageIds };
  } catch (error) {
    console.error("Failed to delete messages:", error);
    return { success: false, error: "Internal server error" };
  }
}
