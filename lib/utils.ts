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
  if (!name) return "??"; // fallback if name is empty

  // Split name by spaces and filter out empty strings
  const words = name.trim().split(/\s+/);

  // Take first letters of first two words
  const initials = words.slice(0, 2).map(word => word[0].toUpperCase()).join('');

  return initials;
}