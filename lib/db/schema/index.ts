import { int, mysqlTable, varchar, text, mysqlEnum, timestamp,
         decimal, char, json, boolean, unique, index } from "drizzle-orm/mysql-core";

/**
 * Users table
 *
 * Stores authentication credentials,
 * profile information and user roles.
 */
export const usersTable = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),

  avatar: varchar("avatar", { length: 500 }),
  avatarPublicId: varchar("avatar_public_id", { length: 255 }),

  name: varchar("name", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),

  updatedAt: timestamp("updated_at", { mode: "string" }).onUpdateNow(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

/**
 * Property listings
 *
 * Represents houses, apartments,
 * condos and land listings.
 */
export const postsTable = mysqlTable(
  "posts",
  {
    id: char("id", { length: 36 }).primaryKey(), // <- UUIDv6

    sellerId: int("seller_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    title: varchar("title", { length: 255 }).notNull(),
    address: varchar("address", { length: 255 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),

    bedrooms: int("bedrooms").notNull(),
    bathrooms: int("bathrooms").notNull(),

    latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
    longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),

    price: decimal("price", { precision: 10, scale: 2 }).notNull(),

    propertyType: mysqlEnum("property_type", [
      "apartment",
      "house",
      "condo",
      "land",
    ]).notNull(),
    listingType: mysqlEnum("listing_type", ["buy", "rent"]).notNull(),

    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).onUpdateNow(),
  },
  (table) => [
    index("search_idx").on(table.city, table.listingType, table.propertyType),
  ],
);

/**
 * Property details
 *
 * One-to-one relationship
 * with a property listing.
 */
export const postDetailsTable = mysqlTable("post_details", {
  id: int("id").primaryKey().autoincrement(),

  postId: char("post_id", { length: 36 })
    .notNull()
    .references(() => postsTable.id, { onDelete: "cascade" }),

  description: json("description").notNull(),
  state: varchar("state", { length: 100 }).notNull(),

  areaSqft: int("area_sqft").notNull(),

  utilitiesPolicy: mysqlEnum("utilities_policy", [
    "owner",
    "tenant",
    "shared",
  ]).notNull(),

  schoolDistance: int("school_distance").default(0),
  busDistance: int("bus_distance").default(0),
  restaurantDistance: int("restaurant_distance").default(0),

  petPolicy: mysqlEnum("pet_policy", ["allowed", "not-allowed"]).notNull(),
  incomePolicy: varchar("income_policy", { length: 500 })
    .default("none")
    .notNull(),
});

/**
 * Property images
 *
 * Stores multiple images
 * for each property.
 */
export const postImagesTable = mysqlTable("post_images", {
  id: int("id").autoincrement().primaryKey(),
  postId: char("post_id", { length: 36 })
    .notNull()
    .references(() => postsTable.id, { onDelete: "cascade" }),
  imageUrl: varchar("image_url", { length: 500 }),
  imagePublicId: varchar("image_public_id", { length: 255 }),
});

/**
 * Property extra features
 *
 * Stores additional features
 * of a property.
 */
export const postFeaturesTable = mysqlTable("post_features", {
  id: int("id").autoincrement().primaryKey(),

  postId: char("post_id", { length: 36 })
    .notNull()
    .references(() => postsTable.id, { onDelete: "cascade" }),

  title: varchar("title", { length: 50 }).notNull(),
  description: varchar("description", { length: 50 }).notNull(),
});

/**
 * Saved posts
 *
 * Users can save their
 * favorite properties here.
 */
export const savedPostsTable = mysqlTable(
  "saved_posts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    postId: char("post_id", { length: 36 })
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),
  },
  (table) => [unique("saved_post_unique").on(table.userId, table.postId)],
);

/**
 * Conversations
 *
 * Private conversations between
 * buyers and sellers.
 */
export const conversationsTable = mysqlTable(
  "conversations",
  {
    id: char("id", { length: 36 }).primaryKey(),
    postId: char("post_id", { length: 36 })
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),

    buyerId: int("buyer_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    sellerId: int("seller_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    lastMessage: text("last_message"),
    lastMessageAt: timestamp("last_message_at", { mode: "string" }),

    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).onUpdateNow(),
  },
  (table) => [
    unique("unique_conversation").on(
      table.postId,
      table.buyerId,
      table.sellerId,
    ),

    index("buyer_idx").on(table.buyerId),
    index("seller_idx").on(table.sellerId),
  ],
);

/**
 * Messages
 *
 * Messages exchanged within
 * conversations.
 */
export const messagesTable = mysqlTable(
  "messages",
  {
    id: char("id", { length: 36 }).primaryKey(),

    conversationId: char("conversation_id", { length: 36 })
      .notNull()
      .references(() => conversationsTable.id, { onDelete: "cascade" }),
    senderId: int("sender_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    message: text("message").notNull(),
    seenAt: timestamp("seen_at", { mode: "string" }),

    isDeleted: boolean("is_deleted").default(false).notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("conversation_idx").on(table.conversationId),
    index("sender_idx").on(table.senderId),
  ],
);
