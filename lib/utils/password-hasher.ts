import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Hashes a plain text password using bcrypt.
 * 
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} The bcrypt hash of the password.
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
}

/**
 * Verifies a password against a bcrypt hash.
 * 
 * @param {string} password - The plain text password to check.
 * @param {string} hash - The stored bcrypt hash to compare against.
 * @returns {Promise<boolean>} True if the password matches the hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}