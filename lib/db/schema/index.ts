import { int, mysqlTable, varchar, text, mysqlEnum, timestamp, decimal, char, json, boolean, unique } from 'drizzle-orm/mysql-core';



// Users Table
export const usersTable = mysqlTable('users', {
  id: int().autoincrement().primaryKey(),

  avatar: text(),
  avatarPublicId: varchar({ length: 255 }),

  name: varchar({ length: 50 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  username: varchar({ length: 50 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: mysqlEnum(["user", "admin"]).default("user").notNull(),

  updatedAt: timestamp({ mode: "string" }).onUpdateNow(),
  createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
});



// Posts Table
export const postsTable = mysqlTable('posts', {
  id: char('id', { length: 36 }).primaryKey(), // <- UUIDv6

  sellerId: int('seller_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),

  title: varchar({ length: 255 }).notNull(),
  address: varchar({ length: 255 }).notNull(),
  city: varchar({ length: 100 }).notNull(),

  bedrooms: int().notNull(),
  bathrooms: int().notNull(),

  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),

  price: decimal({ precision: 10, scale: 2 }).notNull(),

  propertyType: mysqlEnum('property_type', ['apartment', 'house', 'condo', 'land']).notNull(),
  listingType: mysqlEnum('listing_type', ['buy', 'rent']).notNull(),

  updatedAt: timestamp({ mode: 'string' }).onUpdateNow(),
  createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
});



// Post Details Table
export const postDetailsTable = mysqlTable('post_details', {
    id: int('id').primaryKey().autoincrement(),

    postId: char('post_id', { length: 36 }).notNull().references(() => postsTable.id, { onDelete: 'cascade' }),

    description: json('description').notNull(),
    state: varchar('state', { length: 100 }).notNull(),

    areaSqft: int('area_sqft').notNull(),

    utilitiesPolicy: mysqlEnum('utilities_policy', ["owner", "tenant", "shared"]).notNull(),

    schoolDistance: int("school_distance").default(0),
    busDistance: int("bus_distance").default(0),
    restaurantDistance: int("restaurant_distance").default(0),

    petPolicy: mysqlEnum('pet_policy', ["allowed", "not-allowed"]).notNull(),
    incomePolicy: text('income_policy').default("none").notNull(),
});



// Post Images Table
export const postImagesTable = mysqlTable('post_images', {
  id: int('id').primaryKey().autoincrement(),
  postId: char('post_id', { length: 36 }).notNull().references(() => postsTable.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url'),
  imagePublicId: varchar('image_public_id', { length: 255 })
});



// Post Extra Features Table
export const postFeaturesTable = mysqlTable('post_features', {
  id: int('id').primaryKey().autoincrement(),

  postId: char('post_id', { length: 36 }).notNull().references(() => postsTable.id, { onDelete: 'cascade' }),

  title: varchar('title', { length: 50 }).notNull(),
  description: varchar('description', { length: 50 }).notNull(),
});



// Saved Posts Table
export const savedPostsTable = mysqlTable('saved_posts', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  postId: char('post_id', { length: 36 }).notNull().references(() => postsTable.id, { onDelete: 'cascade' }),
});

// Conversations Table
export const conversationsTable = mysqlTable(
  "conversations",
  {
    id: char("id", { length: 36 }).primaryKey(),
    postId: char("post_id", { length: 36 }).notNull().references(() => postsTable.id, { onDelete: "cascade" }),

    buyerId: int("buyer_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    sellerId: int("seller_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),

    lastMessage: text("last_message"),
    lastMessageAt: timestamp("last_message_at", { mode: "string" }),

    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).onUpdateNow(),
  },
  (table) => [
    unique("unique_conversation").on(
      table.postId,
      table.buyerId,
      table.sellerId
    ),
  ]
);

// Messages Table
export const messagesTable = mysqlTable("messages", {
  id: char("id", { length: 36 }).primaryKey(),

  conversationId: char("conversation_id", { length: 36 }).notNull().references(() => conversationsTable.id, { onDelete: "cascade" }),
  senderId: int("sender_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),

  message: text("message").notNull(),
  seenAt: timestamp("seen_at", { mode: "string" }),

  isDeleted: boolean("is_deleted").default(false).notNull(),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});