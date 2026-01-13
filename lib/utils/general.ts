import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"



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