/**
 * Centralized default app-level settings
 */
export const defaultAppSettings = {
    placeholderPostImage: "/images/default-fallback-image.png", // <- Fallback image
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    author: "Shahzaib Awan",
} as const;
