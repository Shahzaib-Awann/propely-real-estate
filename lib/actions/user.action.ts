import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { usersTable } from "../db/schema";



/**
 * === Fetch User for Sign-In ===
 *
 * - Checks credentials by matching email and password.
 *
 * @param email - The email address used to log in.
 * @param password - The raw password (ideally already hashed).
 * @returns A user object with role info, or null if no match.
 * @error If a database error occurs during sign-in.
 */
export const getUserForSignin = async (email: string) => {
    try {
        // === Query: Match user by email and password ===
        const [row] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email))
            .limit(1);

        // === If no match found, return null ===
        if (!row) {
            return null;
        }

        // === Format and normalize user data ===
        return {
            id: String(row.id),
            avatar: row.avatar,
            name: row.name,
            email: row.email,
            password: row.password,
            role: row.role,
            updatedAt: row.updatedAt,
            createdAt: row.createdAt,
        };

    } catch (error) {
        console.error("Signin error:", error);
        return null
    }
};