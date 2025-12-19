"use server";

import { eq } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db/connection";
import { usersTable } from "@/lib/db/schema";



/** Cloudinary Configuration (server-only) */
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



/**
 * === Update user avatar and clean up previous image. ===
 *
 * Updates the user's avatar and removes the previous image if it exists.
 *
 * @param userId - User ID.
 * @param avatarUrl - New avatar URL.
 * @param avatarPublicId - New avatar public ID.
 *
 * @throws {Error} "Invalid_avatar_update_parameters" if inputs are missing.
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function updateUserAvatar({
  userId,
  avatarUrl,
  avatarPublicId,
}: {
  userId: number;
  avatarUrl: string;
  avatarPublicId: string;
}): Promise<{ success: boolean, message: string }> {

  if (!userId || !avatarUrl || !avatarPublicId) {
    return { success: false, message: "Invalid avatar update parameters" }
  }

  // Fetch existing avatar
  const [user] = await db
    .select({
      avatarPublicId: usersTable.avatarPublicId,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  // Delete old avatar (cleanup)
  if (user?.avatarPublicId) {
    try {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    } catch (error) {
      console.warn(
        "Avatar cleanup skipped — previous image could not be removed.",
        error
      );
    }
  }

  // Update DB
  await db
    .update(usersTable)
    .set({
      avatar: avatarUrl,
      avatarPublicId,
    })
    .where(eq(usersTable.id, userId));

    return { success: true, message: "Success" }
}