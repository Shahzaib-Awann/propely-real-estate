import { int, mysqlTable, varchar, text, mysqlEnum, timestamp, decimal } from 'drizzle-orm/mysql-core';

// Users Table
export const usersTable = mysqlTable('users', {
  id: int().autoincrement().primaryKey(),
  avatar: text(),
  name: varchar({ length: 50 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: mysqlEnum(["user", "admin"]).default("user").notNull(),
  updatedAt: timestamp({ mode: "string" }),
  createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
});


// Posts Table

export const postsTable = mysqlTable('posts', {
  id: int().autoincrement().primaryKey(),

  sellerId: int('seller_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),

  title: varchar({ length: 255 }).notNull(),
  image: text(),
  address: varchar({ length: 255 }).notNull(),
  city: varchar({ length: 100 }).notNull(),

  bedrooms: int().notNull(),
  bathrooms: int().notNull(),

  latitude: varchar({ length: 50 }).notNull(),
  longitude: varchar({ length: 50 }).notNull(),

  price: decimal({ precision: 10, scale: 2 }).notNull(),

  propertyType: mysqlEnum('property_type', ['apartment', 'house', 'condo', 'land']).notNull(),
  listingType: mysqlEnum('listing_type', ['buy', 'rent']).notNull(),

  updatedAt: timestamp({ mode: 'string' }),
  createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
});