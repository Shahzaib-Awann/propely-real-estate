"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesTable = exports.conversationsTable = exports.savedPostsTable = exports.postFeaturesTable = exports.postImagesTable = exports.postDetailsTable = exports.postsTable = exports.usersTable = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
/**
 * Users table
 *
 * Stores authentication credentials,
 * profile information and user roles.
 */
exports.usersTable = (0, mysql_core_1.mysqlTable)("users", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    avatar: (0, mysql_core_1.varchar)("avatar", { length: 500 }),
    avatarPublicId: (0, mysql_core_1.varchar)("avatar_public_id", { length: 255 }),
    name: (0, mysql_core_1.varchar)("name", { length: 50 }).notNull(),
    email: (0, mysql_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    password: (0, mysql_core_1.varchar)("password", { length: 255 }).notNull(),
    role: (0, mysql_core_1.mysqlEnum)("role", ["user", "admin"]).default("user").notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at", { mode: "string" }).onUpdateNow(),
    createdAt: (0, mysql_core_1.timestamp)("created_at", { mode: "string" }).defaultNow().notNull(),
});
/**
 * Property listings
 *
 * Represents houses, apartments,
 * condos and land listings.
 */
exports.postsTable = (0, mysql_core_1.mysqlTable)("posts", {
    id: (0, mysql_core_1.char)("id", { length: 36 }).primaryKey(), // <- UUIDv6
    sellerId: (0, mysql_core_1.int)("seller_id")
        .notNull()
        .references(() => exports.usersTable.id, { onDelete: "cascade" }),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    address: (0, mysql_core_1.varchar)("address", { length: 255 }).notNull(),
    city: (0, mysql_core_1.varchar)("city", { length: 100 }).notNull(),
    bedrooms: (0, mysql_core_1.int)("bedrooms").notNull(),
    bathrooms: (0, mysql_core_1.int)("bathrooms").notNull(),
    latitude: (0, mysql_core_1.decimal)("latitude", { precision: 10, scale: 7 }).notNull(),
    longitude: (0, mysql_core_1.decimal)("longitude", { precision: 10, scale: 7 }).notNull(),
    price: (0, mysql_core_1.decimal)("price", { precision: 10, scale: 2 }).notNull(),
    propertyType: (0, mysql_core_1.mysqlEnum)("property_type", [
        "apartment",
        "house",
        "condo",
        "land",
    ]).notNull(),
    listingType: (0, mysql_core_1.mysqlEnum)("listing_type", ["buy", "rent"]).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("created_at", { mode: "string" })
        .defaultNow()
        .notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at", { mode: "string" }).onUpdateNow(),
}, (table) => [
    (0, mysql_core_1.index)("search_idx").on(table.city, table.listingType, table.propertyType),
]);
/**
 * Property details
 *
 * One-to-one relationship
 * with a property listing.
 */
exports.postDetailsTable = (0, mysql_core_1.mysqlTable)("post_details", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    postId: (0, mysql_core_1.char)("post_id", { length: 36 })
        .notNull()
        .references(() => exports.postsTable.id, { onDelete: "cascade" }),
    description: (0, mysql_core_1.json)("description").notNull(),
    state: (0, mysql_core_1.varchar)("state", { length: 100 }).notNull(),
    areaSqft: (0, mysql_core_1.int)("area_sqft").notNull(),
    utilitiesPolicy: (0, mysql_core_1.mysqlEnum)("utilities_policy", [
        "owner",
        "tenant",
        "shared",
    ]).notNull(),
    schoolDistance: (0, mysql_core_1.int)("school_distance").default(0),
    busDistance: (0, mysql_core_1.int)("bus_distance").default(0),
    restaurantDistance: (0, mysql_core_1.int)("restaurant_distance").default(0),
    petPolicy: (0, mysql_core_1.mysqlEnum)("pet_policy", ["allowed", "not-allowed"]).notNull(),
    incomePolicy: (0, mysql_core_1.varchar)("income_policy", { length: 500 })
        .default("none")
        .notNull(),
});
/**
 * Property images
 *
 * Stores multiple images
 * for each property.
 */
exports.postImagesTable = (0, mysql_core_1.mysqlTable)("post_images", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    postId: (0, mysql_core_1.char)("post_id", { length: 36 })
        .notNull()
        .references(() => exports.postsTable.id, { onDelete: "cascade" }),
    imageUrl: (0, mysql_core_1.varchar)("image_url", { length: 500 }),
    imagePublicId: (0, mysql_core_1.varchar)("image_public_id", { length: 255 }),
});
/**
 * Property extra features
 *
 * Stores additional features
 * of a property.
 */
exports.postFeaturesTable = (0, mysql_core_1.mysqlTable)("post_features", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    postId: (0, mysql_core_1.char)("post_id", { length: 36 })
        .notNull()
        .references(() => exports.postsTable.id, { onDelete: "cascade" }),
    title: (0, mysql_core_1.varchar)("title", { length: 50 }).notNull(),
    description: (0, mysql_core_1.varchar)("description", { length: 50 }).notNull(),
});
/**
 * Saved posts
 *
 * Users can save their
 * favorite properties here.
 */
exports.savedPostsTable = (0, mysql_core_1.mysqlTable)("saved_posts", {
    id: (0, mysql_core_1.int)("id").autoincrement().primaryKey(),
    userId: (0, mysql_core_1.int)("user_id")
        .notNull()
        .references(() => exports.usersTable.id, { onDelete: "cascade" }),
    postId: (0, mysql_core_1.char)("post_id", { length: 36 })
        .notNull()
        .references(() => exports.postsTable.id, { onDelete: "cascade" }),
}, (table) => [(0, mysql_core_1.unique)("saved_post_unique").on(table.userId, table.postId)]);
/**
 * Conversations
 *
 * Private conversations between
 * buyers and sellers.
 */
exports.conversationsTable = (0, mysql_core_1.mysqlTable)("conversations", {
    id: (0, mysql_core_1.char)("id", { length: 36 }).primaryKey(),
    postId: (0, mysql_core_1.char)("post_id", { length: 36 })
        .notNull()
        .references(() => exports.postsTable.id, { onDelete: "cascade" }),
    buyerId: (0, mysql_core_1.int)("buyer_id")
        .notNull()
        .references(() => exports.usersTable.id, { onDelete: "cascade" }),
    sellerId: (0, mysql_core_1.int)("seller_id")
        .notNull()
        .references(() => exports.usersTable.id, { onDelete: "cascade" }),
    lastMessage: (0, mysql_core_1.text)("last_message"),
    lastMessageAt: (0, mysql_core_1.timestamp)("last_message_at", { mode: "string" }),
    createdAt: (0, mysql_core_1.timestamp)("created_at", { mode: "string" })
        .defaultNow()
        .notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updated_at", { mode: "string" }).onUpdateNow(),
}, (table) => [
    (0, mysql_core_1.unique)("unique_conversation").on(table.postId, table.buyerId, table.sellerId),
    (0, mysql_core_1.index)("buyer_idx").on(table.buyerId),
    (0, mysql_core_1.index)("seller_idx").on(table.sellerId),
]);
/**
 * Messages
 *
 * Messages exchanged within
 * conversations.
 */
exports.messagesTable = (0, mysql_core_1.mysqlTable)("messages", {
    id: (0, mysql_core_1.char)("id", { length: 36 }).primaryKey(),
    conversationId: (0, mysql_core_1.char)("conversation_id", { length: 36 })
        .notNull()
        .references(() => exports.conversationsTable.id, { onDelete: "cascade" }),
    senderId: (0, mysql_core_1.int)("sender_id")
        .notNull()
        .references(() => exports.usersTable.id, { onDelete: "cascade" }),
    message: (0, mysql_core_1.text)("message").notNull(),
    seenAt: (0, mysql_core_1.timestamp)("seen_at", { mode: "string" }),
    isDeleted: (0, mysql_core_1.boolean)("is_deleted").default(false).notNull(),
    deletedAt: (0, mysql_core_1.timestamp)("deleted_at", { mode: "string" }),
    createdAt: (0, mysql_core_1.timestamp)("created_at", { mode: "string" })
        .defaultNow()
        .notNull(),
}, (table) => [
    (0, mysql_core_1.index)("conversation_idx").on(table.conversationId),
    (0, mysql_core_1.index)("sender_idx").on(table.senderId),
]);
