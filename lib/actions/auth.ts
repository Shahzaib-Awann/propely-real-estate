"use server"

import { signOut } from "@/auth"

/**
 * === Handle Sign Out Action ===
 *
 * Executes the server-side logout process.
 *
 * @returns Promise<void> - Resolves when user session is fully terminated
 */
export async function handleSignOutAction() {
  await signOut()
}