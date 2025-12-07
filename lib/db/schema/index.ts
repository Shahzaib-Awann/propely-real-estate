import { int, mysqlTable, varchar, text, mysqlEnum, timestamp } from 'drizzle-orm/mysql-core';

// Users Table
export const usersTable = mysqlTable('users', {
  id: int().autoincrement().primaryKey(),
  avatar: text(),
  name: varchar({ length: 50 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 50 }).notNull(),
  role: mysqlEnum(["user", "admin"]).default("user").notNull(),
  updatedAt: timestamp({ mode: "string" }),
  createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
});