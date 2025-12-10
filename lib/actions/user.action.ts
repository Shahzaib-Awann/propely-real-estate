import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { usersTable } from "../db/schema";
import { hashPassword } from "../utils/passwordHasher";



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



/**
 * === Create New User For Sign-Up ===
 *
 * - Creates a new user with hashed password; errors if email exists.
 *
 * @param name - Full name of the user.
 * @param email - Unique email address.
 * @param password - Plaintext password to hash and store.
 * @throws "EMAIL_ALREADY_EXISTS" if email is already in use.
 * @returns Resolves when user is successfully created.
 */
export const createUserForSignUp = async (name: string, email: string, password: string) => {

    // === Check existing user ===
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

    // === Error if email already exists ===
    if (existing.length > 0) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const hashedPassword = await hashPassword(password)

    // === Insert new user record ===
    await db.insert(usersTable).values({
        name,
        email,
        password: hashedPassword,
    });
};