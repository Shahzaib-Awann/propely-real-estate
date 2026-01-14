
type LexicalTransformMode = "to-json" | "to-lexical";


// Default empty editor state for Lexical
export const LEXICAL_EMPTY_STATE = JSON.stringify({
  root: {
    children: [
      {
        children: [],
        direction: null,
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: null,
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
});



/**
 * === Transform Lexical content between formats. ===
 *
 * Converts Lexical editor content into either:
 * - a safe JSON object for database storage (`to-json`)
 * - a canonical Lexical editorState string (`to-lexical`)
 *
 * @param value - Incoming Lexical content (stringified, object, or unknown).
 * @param mode - Transformation mode:
 *  - `"to-json"` converts content for DB persistence
 *  - `"to-lexical"` converts content for Lexical editor usage
 *
 * @returns
 * - `Record<string, unknown>` when converting to JSON
 * - `string` when converting to Lexical
 * - `null` when conversion fails or input is invalid (JSON mode only)
 */
export function parseLexicalContent(
  value: unknown,
  mode: LexicalTransformMode
): Record<string, unknown> | string | null {
  if (!value) {
    return mode === "to-lexical" ? LEXICAL_EMPTY_STATE : null;
  }

  // === TO JSON (for DB) ===
  if (mode === "to-json") {
    if (typeof value === "object") {
      return value as Record<string, unknown>;
    }

    if (typeof value === "string") {
      try {
        return JSON.parse(value) as Record<string, unknown>;
      } catch {
        return null;
      }
    }

    return null;
  }

  // === TO LEXICAL (for Editor) ===
  if (mode === "to-lexical") {
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === "object" && "root" in parsed) {
          return value; // already valid
        }
        return LEXICAL_EMPTY_STATE;
      } catch {
        return LEXICAL_EMPTY_STATE;
      }
    }

    if (typeof value === "object") {
      try {
        const obj = value as Record<string, unknown>;
        if ("root" in obj) {
          return JSON.stringify(obj);
        }
        return LEXICAL_EMPTY_STATE;
      } catch {
        return LEXICAL_EMPTY_STATE;
      }
    }

    return LEXICAL_EMPTY_STATE;
  }

  return null;
}