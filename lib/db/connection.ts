import { drizzle } from "drizzle-orm/mysql2";

// Initialize Drizzle ORM with MySQL connection
export const db = drizzle({
  connection: {
    uri: `mysql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
  },
});