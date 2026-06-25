"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mysql2_1 = require("drizzle-orm/mysql2");
// Initialize Drizzle ORM with MySQL connection
exports.db = (0, mysql2_1.drizzle)({
    connection: {
        uri: `mysql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
    },
});
