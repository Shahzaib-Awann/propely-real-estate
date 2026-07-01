"use server";

import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { usersTable } from "../db/schema";
import { hashPassword } from "../utils/bcrypt";
import { FullUser, SafeUser, SignInUser } from "../../types/user.type";

/**
 * === Fetch user by email for authentication. ===
 *
 * Used during sign-in to retrieve the user's
 * account information and hashed password.
 *
 * @param email - User email address.
 * @returns User record if found, otherwise null.
 */
export const getUserForSignin = async (
  email: string,
): Promise<SignInUser | null> => {
  try {

    const normalizedEmail = email.trim().toLowerCase();

    // === Query: Match user by email and password ===
    const [user] = await db
      .select({
        id: usersTable.id,
        avatar: usersTable.avatar,
        name: usersTable.name,
        email: usersTable.email,
        password: usersTable.password,
        role: usersTable.role,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      })
      .from(usersTable)
      .where(eq(usersTable.email, normalizedEmail))
      .limit(1);

    return user ?? null;
  } catch (error) {
    console.error("[getUserForSignin] Failed to fetch user:", error);

    return null;
  }
};

/**
 * === Create new user account ===
 *
 * Registers a new user with hashed password.
 * Relies on DB unique constraint for email validation.
 *
 * @param name - Full name of user
 * @param email - Unique email address
 * @param password - Plain password (will be hashed)
 * @throws EMAIL_ALREADY_EXISTS if email already exists
 */
export const createUserForSignUp = async (
  name: string,
  email: string,
  password: string,
): Promise<void> => {
  // === Normalize email ===
  const normalizedEmail = email.trim().toLowerCase();

  // === Check existing user ===
  const [existing] = await db
  .select({
    id: usersTable.id,
    email: usersTable.email,
  })
  .from(usersTable)
  .where(eq(usersTable.email, normalizedEmail))
  .limit(1);

  // === Error if email or username already exists ===
  if (existing) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const hashedPassword = await hashPassword(password);

  // === Insert new user record ===
  await db.insert(usersTable).values({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });
};

/**
 * === Update User Profile ===
 *
 * Updates user name and email.
 * Enforces email uniqueness via DB constraint.
 *
 * @throws USER_NOT_FOUND
 * @throws EMAIL_ALREADY_EXISTS
 */
export const updateUserProfileInfo = async (
  userId: number,
  name: string,
  email: string,
) => {
  try {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // === Update user in DB ===
    const result = await db
      .update(usersTable)
      .set({
        name: normalizedName,
        email: normalizedEmail,
      })
      .where(eq(usersTable.id, userId));

    const affectedRows = result[0].affectedRows;

    // === No user found ===
    if (affectedRows === 0) {
      throw new Error("USER_NOT_FOUND");
    }
  } catch (error: unknown) {
    const err = error as Error & {
      cause?: {
        code?: string;
        sqlMessage?: string;
      };
    };

    const cause = err.cause;

    // === MySQL duplicate email ===
    if (cause?.code === "ER_DUP_ENTRY") {
      const msg = cause.sqlMessage?.toLowerCase() || "";

      if (msg.includes("email")) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }

      throw new Error("DUPLICATE_VALUE");
    }

    throw error;
  }
};

/**
 * === Fetch a user by ID from the database. ===
 *
 * @param id - User ID to fetch
 * @param safe - If true, password will be omitted from the returned object (default: true)
 * @returns User object (safe or full) or null if not found
 */
export const getUserById = async (
  id: number,
  safe: boolean = true,
): Promise<SafeUser | FullUser | null> => {
  // === Fetch only required fields ===
  const [user] = await db
    .select({
      id: usersTable.id,
      avatar: usersTable.avatar,
      avatarPublicId: usersTable.avatarPublicId,
      name: usersTable.name,
      email: usersTable.email,
      password: usersTable.password,
      role: usersTable.role,
      createdAt: usersTable.createdAt,
      updatedAt: usersTable.updatedAt,
    })
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);

  // === If no match found, return null ===
  if (!user) {
    return null;
  }

  // === Return safe version ===
  if (safe) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  // === Return full version ===
  return user;
};
