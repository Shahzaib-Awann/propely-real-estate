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