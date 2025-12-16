import { eq, sql } from "drizzle-orm";
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



type MySqlCauseError = {
    code?: string
    errno?: number
  }
  


/**
 * === Update User Profile Info ===
 *
 * - Updates the name and email of an existing user.
 * - Returns 404 if the user does not exist.
 * - Returns 409 if the email is already in use.
 *
 * @param userId - ID of the user to update.
 * @param name - New full name of the user.
 * @param email - New unique email address.
 * @returns An object with `ok`, `status`, and `message` indicating the result.
 * @throws Re-throws unknown errors encountered during update.
 */
  export const updateUserProfileInfo = async (
    userId: number,
    name: string,
    email: string
  ) => {
    try {

        // === Update user in DB ===
      const result = await db
        .update(usersTable)
        .set({
          name,
          email,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(usersTable.id, userId))
  
      const affectedRows = result[0].affectedRows
  
      // === No user found ===
      if (affectedRows === 0) {
        return { ok: false, status: 404, message: "User not found", }
      }
      
    // === Success ===
      return { ok: true, status: 200, message: "Profile updated successfully", }
    } catch (error: unknown) {
      
      if (error instanceof Error && "cause" in error && typeof error.cause === "object" && error.cause !== null) {
        const cause = error.cause as MySqlCauseError
  
        // === Duplicate email ===
        if (cause.code === "ER_DUP_ENTRY" || cause.errno === 1062) {
          return { ok: false, status: 409, message: "Email already exists", }
        }
      }
  
      // === Re-throw unknown errors ===
      throw error
    }
  }



/**
 * === Fetch a user by ID from the database. ===
 * 
 * @param id - User ID to fetch
 * @param safe - If true, password will be omitted from the returned object (default: true)
 * @returns User object (safe or full) or null if not found
 */
export const getUserById = async (id: number, safe: boolean = true) => {
  // === Query: match user by ID ===
  const [row] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);

  // === If no match found, return null ===
  if (!row) {
    return null;
  }

  // === Format user data ===
  const baseUser = {
    id: String(row.id),
    avatar: row.avatar,
    name: row.name,
    email: row.email,
    role: row.role,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };

  if (safe) return baseUser;

  return {
    ...baseUser,
    password: row.password,
  };
};