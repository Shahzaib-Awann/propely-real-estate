// components/widgets/editor/LexicalViewer.tsx
"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import type { SerializedEditorState } from "lexical";



/**
 * Supported value types for the Lexical viewer.
 * - `string`: Serialized editor state as a JSON string
 * - `SerializedEditorState`: Raw Lexical editor state object
 */
type LexicalValue = string | SerializedEditorState;

const EMPTY_STATE = JSON.stringify({
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
 * === Read-only Lexical rich-text viewer ===
 *
 * A read-only Lexical editor used for rendering rich-text content.
 * This component is intended for displaying content only (no editing).
 *
 * Features:
 * - Accepts either a serialized JSON string or a Lexical editor state object
 * - Normalizes the editor state before rendering
 * - Runs entirely in read-only mode
 *
 * @param value - Serialized Lexical content to render
 */
export default function LexicalViewer({ value }: { value: LexicalValue }) {

  // Normalize editor state to JSON string
  const editorState =
    typeof value === "string"
      ? value
      : value && typeof value === "object"
        ? JSON.stringify(value)
        : EMPTY_STATE;

  return (
    <LexicalComposer
      initialConfig={{
        namespace: "Viewer",
        editorState,
        editable: false,
        onError(error) {
          console.error("Lexical Viewer Error:", error);
        },
      }}
    >
      
      {/* Render rich-text content */}
      <RichTextPlugin
        contentEditable={<ContentEditable className="outline-none" />}
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />

      {/* Maintain editor state compatibility */}
      <HistoryPlugin />
    </LexicalComposer>
  );
}