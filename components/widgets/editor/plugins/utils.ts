/**
 * === Normalizes Lexical editor content for storage. ===
 * 
 * - Accepts stringified JSON or already-parsed object
 * - Safely parses JSON
 * - Always returns a serializable object or null
 */
export function parseLexicalContent(
    value: unknown
  ): Record<string, unknown> | null {
    if (!value) return null;
  
    // Already parsed Lexical JSON
    if (typeof value === "object") {
      return value as Record<string, unknown>;
    }
  
    // Stringified Lexical JSON
    if (typeof value === "string") {
      try {
        return JSON.parse(value) as Record<string, unknown>;
      } catch (error) {
        console.error("Invalid Lexical JSON:", error);
        return null;
      }
    }
  
    return null;
  }