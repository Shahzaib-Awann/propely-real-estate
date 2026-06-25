"use server";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserConversations = getUserConversations;
exports.createOrGetConversation = createOrGetConversation;
exports.getConversationById = getConversationById;
exports.getConversationMessages = getConversationMessages;
exports.sendMessage = sendMessage;
exports.markConversationAsSeen = markConversationAsSeen;
// @/lib/actions/chat.action.ts
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_1 = require("drizzle-orm/mysql-core");
const uuid_1 = require("uuid");
const connection_1 = require("../db/connection");
const schema_1 = require("../db/schema");
async function getUserConversations(userId) {
    const buyer = (0, mysql_core_1.alias)(schema_1.usersTable, "buyer");
    const seller = (0, mysql_core_1.alias)(schema_1.usersTable, "seller");
    const rows = await connection_1.db
        .select({
        id: schema_1.conversationsTable.id,
        propertyId: schema_1.conversationsTable.postId,
        propertyTitle: (0, drizzle_orm_1.sql) `
        COALESCE(${schema_1.postsTable.title}, 'Unknown Property')
      `,
        otherUserId: (0, drizzle_orm_1.sql) `
        CASE
          WHEN ${schema_1.conversationsTable.buyerId} = ${userId}
          THEN ${schema_1.conversationsTable.sellerId}
          ELSE ${schema_1.conversationsTable.buyerId}
        END
      `,
        otherUserName: (0, drizzle_orm_1.sql) `
        CASE
          WHEN ${schema_1.conversationsTable.buyerId} = ${userId}
          THEN ${seller.name}
          ELSE ${buyer.name}
        END
      `,
        otherUserAvatar: (0, drizzle_orm_1.sql) `
        CASE
          WHEN ${schema_1.conversationsTable.buyerId} = ${userId}
          THEN ${seller.avatar}
          ELSE ${buyer.avatar}
        END
      `,
        lastMessage: schema_1.conversationsTable.lastMessage,
        lastMessageAt: schema_1.conversationsTable.lastMessageAt,
        unreadCount: (0, drizzle_orm_1.sql) `
        (
          SELECT COUNT(*)
          FROM ${schema_1.messagesTable}
          WHERE
            ${schema_1.messagesTable.conversationId} = ${schema_1.conversationsTable.id}
            AND ${schema_1.messagesTable.senderId} != ${userId}
            AND ${schema_1.messagesTable.seenAt} IS NULL
            AND ${schema_1.messagesTable.isDeleted} = 0
        )
      `,
    })
        .from(schema_1.conversationsTable)
        .leftJoin(schema_1.postsTable, (0, drizzle_orm_1.eq)(schema_1.postsTable.id, schema_1.conversationsTable.postId))
        .leftJoin(buyer, (0, drizzle_orm_1.eq)(buyer.id, schema_1.conversationsTable.buyerId))
        .leftJoin(seller, (0, drizzle_orm_1.eq)(seller.id, schema_1.conversationsTable.sellerId))
        .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.conversationsTable.buyerId, userId), (0, drizzle_orm_1.eq)(schema_1.conversationsTable.sellerId, userId)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.conversationsTable.lastMessageAt));
    return rows;
}
async function createOrGetConversation({ buyerId, postId, }) {
    return connection_1.db.transaction(async (tx) => {
        // 1. Find property
        const [property] = await tx
            .select({
            sellerId: schema_1.postsTable.sellerId,
        })
            .from(schema_1.postsTable)
            .where((0, drizzle_orm_1.eq)(schema_1.postsTable.id, postId));
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
            id: schema_1.conversationsTable.id,
        })
            .from(schema_1.conversationsTable)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.conversationsTable.postId, postId), (0, drizzle_orm_1.eq)(schema_1.conversationsTable.buyerId, buyerId), (0, drizzle_orm_1.eq)(schema_1.conversationsTable.sellerId, property.sellerId)));
        if (existingConversation) {
            return {
                conversationId: existingConversation.id,
                isNew: false,
            };
        }
        // 4. Create conversation
        const conversationId = (0, uuid_1.v6)();
        await tx.insert(schema_1.conversationsTable).values({
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
async function getConversationById(conversationId, userId) {
    const result = await connection_1.db
        .select({
        id: schema_1.conversationsTable.id,
        propertyId: schema_1.postsTable.id,
        propertyTitle: schema_1.postsTable.title,
        buyerId: schema_1.conversationsTable.buyerId,
        sellerId: schema_1.conversationsTable.sellerId,
        otherUserId: schema_1.usersTable.id,
        otherUserName: schema_1.usersTable.name,
        otherUserAvatar: schema_1.usersTable.avatar,
    })
        .from(schema_1.conversationsTable)
        .innerJoin(schema_1.postsTable, (0, drizzle_orm_1.eq)(schema_1.postsTable.id, schema_1.conversationsTable.postId))
        .innerJoin(schema_1.usersTable, (0, drizzle_orm_1.sql) `
        ${schema_1.usersTable.id} =
        CASE
          WHEN ${schema_1.conversationsTable.buyerId} = ${userId}
          THEN ${schema_1.conversationsTable.sellerId}
          ELSE ${schema_1.conversationsTable.buyerId}
        END
      `)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.conversationsTable.id, conversationId), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.conversationsTable.buyerId, userId), (0, drizzle_orm_1.eq)(schema_1.conversationsTable.sellerId, userId))))
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
async function getConversationMessages(conversationId) {
    const messages = await connection_1.db
        .select({
        id: schema_1.messagesTable.id,
        conversationId: schema_1.messagesTable.conversationId,
        senderId: schema_1.messagesTable.senderId,
        message: schema_1.messagesTable.message,
        seenAt: schema_1.messagesTable.seenAt,
        isDeleted: schema_1.messagesTable.isDeleted,
        createdAt: schema_1.messagesTable.createdAt,
        buyerId: schema_1.conversationsTable.buyerId,
        sellerId: schema_1.conversationsTable.sellerId,
    })
        .from(schema_1.messagesTable)
        .innerJoin(schema_1.conversationsTable, (0, drizzle_orm_1.eq)(schema_1.messagesTable.conversationId, schema_1.conversationsTable.id))
        .where((0, drizzle_orm_1.eq)(schema_1.messagesTable.conversationId, conversationId))
        .orderBy((0, drizzle_orm_1.asc)(schema_1.messagesTable.createdAt));
    return messages.map((msg) => ({
        id: msg.id,
        conversationId: msg.conversationId,
        senderId: msg.senderId,
        receiverId: msg.senderId === msg.buyerId
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
async function sendMessage({ conversationId, senderId, message, }) {
    // Validate sender
    const [sender] = await connection_1.db.select({ id: schema_1.usersTable.id }).from(schema_1.usersTable).where((0, drizzle_orm_1.eq)(schema_1.usersTable.id, senderId));
    if (!sender) {
        return null;
    }
    // Validate conversation + membership
    const [conversation] = await connection_1.db.select({ id: schema_1.conversationsTable.id })
        .from(schema_1.conversationsTable).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.conversationsTable.id, conversationId), (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.conversationsTable.buyerId, senderId), (0, drizzle_orm_1.eq)(schema_1.conversationsTable.sellerId, senderId))));
    if (!conversation) {
        return null;
    }
    return await connection_1.db.transaction(async (tx) => {
        const messageId = (0, uuid_1.v6)();
        await tx
            .insert(schema_1.messagesTable)
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
            .update(schema_1.conversationsTable)
            .set({
            lastMessage: message,
            lastMessageAt: now,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.conversationsTable.id, conversationId));
        const [createdMessage] = await tx
            .select({
            id: schema_1.messagesTable.id,
            conversationId: schema_1.messagesTable.conversationId,
            senderId: schema_1.messagesTable.senderId,
            // derive receiver properly from conversation
            buyerId: schema_1.conversationsTable.buyerId,
            sellerId: schema_1.conversationsTable.sellerId,
            message: schema_1.messagesTable.message,
            seenAt: schema_1.messagesTable.seenAt,
            isDeleted: schema_1.messagesTable.isDeleted,
            createdAt: schema_1.messagesTable.createdAt,
        })
            .from(schema_1.messagesTable)
            .innerJoin(schema_1.conversationsTable, (0, drizzle_orm_1.eq)(schema_1.messagesTable.conversationId, schema_1.conversationsTable.id))
            .where((0, drizzle_orm_1.eq)(schema_1.messagesTable.id, messageId));
        const receiverId = createdMessage.senderId === createdMessage.buyerId
            ? createdMessage.sellerId
            : createdMessage.buyerId;
        return {
            ...createdMessage,
            receiverId,
        };
    });
}
async function markConversationAsSeen(conversationId, viewerId) {
    // 1. Validate conversation + access
    const [conversation] = await connection_1.db.select({ id: schema_1.conversationsTable.id, buyerId: schema_1.conversationsTable.buyerId, sellerId: schema_1.conversationsTable.sellerId })
        .from(schema_1.conversationsTable).where((0, drizzle_orm_1.eq)(schema_1.conversationsTable.id, conversationId));
    if (!conversation)
        return null;
    const isParticipant = conversation.buyerId === viewerId ||
        conversation.sellerId === viewerId;
    if (!isParticipant)
        return null;
    const now = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    // 2. Mark all incoming messages as seen
    await connection_1.db
        .update(schema_1.messagesTable)
        .set({
        seenAt: now,
    })
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.messagesTable.conversationId, conversationId), (0, drizzle_orm_1.ne)(schema_1.messagesTable.senderId, viewerId), (0, drizzle_orm_1.isNull)(schema_1.messagesTable.seenAt)));
    return { success: true };
}
