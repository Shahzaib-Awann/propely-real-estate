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



// Post Details Table
export const postDetailsTable = mysqlTable('post_details', {
    id: int('id').primaryKey().autoincrement(),

    postId: int('post_id').notNull().references(() => postsTable.id, { onDelete: 'cascade' }),

    description: text('description').notNull(),
    state: varchar('state', { length: 100 }).notNull(),

    areaSqft: int('area_sqft').notNull(),

    utilitiesPolicy: text('utilities_policy').default("none").notNull(),

    schoolDistance: varchar('school_distance', { length: 15 }),
    busDistance: varchar('bus_distance', { length: 15 }),
    restaurantDistance: varchar('restaurant_distance', { length: 15 }),

    petPolicy: text('pet_policy').default("none"),
    incomePolicy: text('income_policy').default("none").notNull(),
});



// Post Images Table
export const postImagesTable = mysqlTable('post_images', {
  id: int('id').primaryKey().autoincrement(),
  
  postId: int('post_id').notNull().references(() => postsTable.id, { onDelete: 'cascade' }),

  imageUrl: text('image_url'),
});



// Post Extra Features Table
export const postFeaturesTable = mysqlTable('post_features', {
  id: int('id').primaryKey().autoincrement(),

  postId: int('post_id').notNull().references(() => postsTable.id, { onDelete: 'cascade' }),

  title: varchar('title', { length: 50 }).notNull(),
  description: varchar('description', { length: 50 }).notNull(),
});