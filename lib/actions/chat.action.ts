"use server";

// @/lib/actions/chat.action.ts

import { and, asc, desc, eq, isNull, ne, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";
import { v6 as uuidv6 } from 'uuid';

import { db } from "../db/connection";
import {
  conversationsTable,
  postsTable,
  usersTable,
  messagesTable,
} from "../db/schema";

import { ConversationHeader, ConversationListItem, RealtimeMessage } from "@/types/propely.chat";

export async function getUserConversations(
  userId: number
): Promise<ConversationListItem[]> {

  const buyer = alias(usersTable, "buyer");
  const seller = alias(usersTable, "seller");

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
    .leftJoin(
      postsTable,
      eq(postsTable.id, conversationsTable.postId)
    )
    .leftJoin(
      buyer,
      eq(buyer.id, conversationsTable.buyerId)
    )
    .leftJoin(
      seller,
      eq(seller.id, conversationsTable.sellerId)
    )
    .where(
      or(
        eq(conversationsTable.buyerId, userId),
        eq(conversationsTable.sellerId, userId)
      )
    )
    .orderBy(
      desc(conversationsTable.lastMessageAt)
    );

  return rows;
}

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
      eq(conversationsTable.sellerId, userId)
    ),
    ne(messagesTable.senderId, userId),
    isNull(messagesTable.seenAt),
  ];

  // 2. If scope is 'single' and a conversationId is provided, narrow the search
  if (scope === "single" && conversationId) {
    conditions.push(eq(messagesTable.conversationId, conversationId));
  }

  const result = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(messagesTable)
    .innerJoin(
      conversationsTable,
      eq(messagesTable.conversationId, conversationsTable.id)
    )
    .where(and(...conditions));

  return Number(result[0]?.count ?? 0);
}

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
    // 1. Find property
    const [property] = await tx
      .select({
        sellerId: postsTable.sellerId,
      })
      .from(postsTable)
      .where(eq(postsTable.id, postId));

    if (!property) {
      throw new Error("Property not found");
    }

    // 2. Prevent self-chat
    if (property.sellerId === buyerId) {
      throw new Error("You cannot start a conversation with yourself");
    }

    // 3. Check existing conversation
    const [existingConversation] = await tx
      .select({
        id: conversationsTable.id,
      })
      .from(conversationsTable)
      .where(
        and(
          eq(conversationsTable.postId, postId),
          eq(conversationsTable.buyerId, buyerId),
          eq(conversationsTable.sellerId, property.sellerId)
        )
      );

    if (existingConversation) {
      return {
        conversationId: existingConversation.id,
        isNew: false,
      };
    }

    // 4. Create conversation
    const conversationId = uuidv6();

    await tx.insert(conversationsTable).values({
      id: conversationId,
      postId,
      buyerId,
      sellerId: property.sellerId,
    });

    return {
      conversationId,
      isNew: true,
    };
  });
}


export async function getConversationById(conversationId: string, userId: number): Promise<ConversationHeader | null> {
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
    .innerJoin(
      postsTable,
      eq(postsTable.id, conversationsTable.postId)
    )
    .innerJoin(
      usersTable,
      sql`
        ${usersTable.id} =
        CASE
          WHEN ${conversationsTable.buyerId} = ${userId}
          THEN ${conversationsTable.sellerId}
          ELSE ${conversationsTable.buyerId}
        END
      `
    )
    .where(
      and(
        eq(conversationsTable.id, conversationId),
        or(
          eq(conversationsTable.buyerId, userId),
          eq(conversationsTable.sellerId, userId)
        )
      )
    )
    .limit(1);

  const conversation = result[0];

  if (!conversation) {
    return null;
  }

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


export async function getConversationMessages(
  conversationId: string,
): Promise<RealtimeMessage[]> {
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
    .where(eq(messagesTable.conversationId, conversationId))
    .orderBy(asc(messagesTable.createdAt));

  return messages.map((msg) => ({
    id: msg.id,
    conversationId: msg.conversationId,
    senderId: msg.senderId,
    receiverId:
      msg.senderId === msg.buyerId
        ? msg.sellerId
        : msg.buyerId,
    buyerId: msg.buyerId,
    sellerId: msg.sellerId,
    message: msg.isDeleted
      ? "This message was deleted"
      : msg.message,
    seenAt: msg.seenAt,
    isDeleted: msg.isDeleted,
    createdAt: msg.createdAt,
  }));
}

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
  const [sender] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.id, senderId));

  if (!sender) {
    return null;
  }

  // Validate conversation + membership
  const [conversation] = await db.select({ id: conversationsTable.id })
  .from(conversationsTable).where(and(
      eq(conversationsTable.id, conversationId),
      or(
        eq(conversationsTable.buyerId, senderId),
        eq(conversationsTable.sellerId, senderId)
      )
    ));

  if (!conversation) {
    return null;
  }

  return await db.transaction(async (tx) => {
    const messageId = uuidv6();

    await tx
      .insert(messagesTable)
      .values({
        id: messageId,
        conversationId,
        senderId,
        message,
      });

    const now = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    await tx
      .update(conversationsTable)
      .set({
        lastMessage: message,
        lastMessageAt: now,
      })
      .where(eq(conversationsTable.id, conversationId));

    const [createdMessage] = await tx
  .select({
    id: messagesTable.id,
    conversationId: messagesTable.conversationId,
    senderId: messagesTable.senderId,

    // derive receiver properly from conversation
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
    eq(messagesTable.conversationId, conversationsTable.id)
  )
  .where(eq(messagesTable.id, messageId));

  const receiverId =
  createdMessage.senderId === createdMessage.buyerId
    ? createdMessage.sellerId
    : createdMessage.buyerId;

    return {
  ...createdMessage,
  receiverId,
};
  });
}



export async function markConversationAsSeen(conversationId: string, viewerId: number) {
  // 1. Validate conversation + access
  const [conversation] = await db.select({ id: conversationsTable.id, buyerId: conversationsTable.buyerId, sellerId: conversationsTable.sellerId })
  .from(conversationsTable).where(eq(conversationsTable.id, conversationId));

  if (!conversation) return null;

  const isParticipant =
    conversation.buyerId === viewerId ||
    conversation.sellerId === viewerId;

  if (!isParticipant) return null;

  const now = new Date()
  .toISOString()
  .slice(0, 19)
  .replace("T", " ");

  // 2. Mark all incoming messages as seen
  await db
    .update(messagesTable)
    .set({
      seenAt: now,
    })
    .where(
      and(
        eq(messagesTable.conversationId, conversationId),
        ne(messagesTable.senderId, viewerId),
        isNull(messagesTable.seenAt)
      )
    );

  return { success: true };
}