import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  isToday,
  isYesterday,
  format,
  isValid,
} from "date-fns";



/**
 * === Merge and conditionally join Tailwind CSS class names. ===
 *
 * Combines multiple class values using `clsx` and merges Tailwind classes
 * intelligently with `tailwind-merge` to prevent conflicts.
 *
 * @param {...ClassValue[]} inputs - Class names, arrays, or conditional objects.
 * @returns {string} - A single merged class string ready for use in `className`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



/**
 * === Generate avatar initials from a user's full name. ===
 *
 * Takes the first letters of the first two words in a name to create
 * a fallback avatar string. Returns a default placeholder if the name
 * is empty or invalid.
 *
 * @param {string} name - The full name of the user.
 * @returns {string} - Uppercase initials (e.g., "JD") or "??" if empty.
 */
export function getAvatarFallback(name: string): string {
  if (!name || name?.trim() === "") return "??"; // fallback if name is empty

  // Split name by spaces and filter out empty strings
  const words = name.trim().split(/\s+/);

  // Take first letters of first two words
  const initials = words.slice(0, 2).map(word => word[0].toUpperCase()).join('');

  return initials;
}


/**
 * === Build URLSearchParams from an object, ignoring undefined or empty values. ===
 *
 * Converts the provided object's entries into URLSearchParams, filtering out
 * any keys with `undefined` or empty string values and converting all values to strings.
 *
 * @template T - Object type containing query parameters.
 * @param {T} params - Object of key-value pairs to convert into search params.
 * @returns - URLSearchParams instance ready for use in URLs.
 */
export function buildSearchParams<T extends object>(params: T) {
  return new URLSearchParams(
    Object.entries(params as Record<string, unknown>)
      .filter(([, value]) => value !== undefined && value !== "")
      .map(([key, value]) => [key, String(value)])
  );
}



/**
 * === Format distance from meters to meters/kilometers ===
 *
 * Formats a distance in meters into a readable string (m or km).
 * Handles null or undefined values with a safe fallback.
 *
 * @param {number | null | undefined} meters - Distance value in meters.
 * @returns {string} - Formatted distance (e.g., "850m", "1.2km", "0m").
 */
export function formatMeters(meters: number | null | undefined): string {
  // Return fallback if value is null or undefined
  if (meters == null) return "0m";

  // Show meters for distances under 1 kilometer
  if (meters < 1000) {
    return `${meters}m`;
  }

  // Convert meters to kilometers
  const km = meters / 1000;

  // Remove trailing .0 for whole kilometers
  return `${km % 1 === 0 ? km : km.toFixed(1)}km`;
}


/**
 * Returns a safe image URL fallback if the provided source is missing or invalid.
 * Ensures UI never breaks due to broken or empty image URLs.
 */
export const safeImage = (src?: string | null) => {
  if (!src || src === "") {
    return "/images/default-fallback-image.png";
  }

  if (src.startsWith("http")) return src;

  return "/images/default-fallback-image.png";
};



/**
 * === Format last message time ===
 *
 * Formats the last message time into a human-readable string (e.g., "now", "2m", "3h", "Yesterday", "5d").
 *
 * @param {string} dateString - The date string of the last message (e.g., "2026-06-19 13:08:43").
 * @returns {string} - The formatted time string.
 */
export function formatLastMessageTime(dateString: string) {

  if (!dateString) {
    return "";
  }

  const date = new Date(dateString.replace(" ", "T") + "Z");
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString();
}



/**
 * === Format Date Utility (date-fns based) ===
 *
 * Formats a date string into readable UI formats.
 * Supports time, date, full, and smart relative display.
 *
 * Handles MySQL datetime strings safely before parsing.
 */
export function formatDateFns(
  dateString?: string | null,
  type: "time"
  | "date"
  | "full"
  | "smart" = "smart"
) {
  if (!dateString) return "";

  // Fix MySQL format: "2026-06-21 22:00:16" → ISO compatible
  const date = new Date(
    dateString.replace(" ", "T")
  );

  if (!isValid(date)) return "";

  switch (type) {
    /**
     * 09:45 PM
     */
    case "time":
      return format(date, "hh:mm a");

    /**
     * Jun 21, 2026
     */
    case "date":
      return format(date, "MMM d, yyyy");

    /**
     * Jun 21, 2026 • 09:45 PM
     */
    case "full":
      return `${format(
        date,
        "MMM d, yyyy"
      )} • ${format(date, "hh:mm a")}`;

    /**
     * Smart chat format:
     * Today / Yesterday / Jun 21, 2026
     */
    case "smart":
    default:
      if (isToday(date)) return "Today";
      if (isYesterday(date)) return "Yesterday";
      return format(date, "MMM d, yyyy");
  }
}