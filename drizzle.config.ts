import { defineConfig } from "drizzle-kit";

// Drizzle Kit configuration
export default defineConfig({
  out: "./lib/db/migrations/",
  schema: "./lib/db/schema/",
  dialect: "mysql",
  dbCredentials: {
    url: `mysql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
  },
});
