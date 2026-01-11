// components/widgets/editor/LexicalViewer.tsx
"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import type { SerializedEditorState } from "lexical";

type LexicalValue = string | SerializedEditorState;

export default function LexicalViewer({ value }: { value: LexicalValue }) {
  const editorState =
    typeof value === "string" ? value : JSON.stringify(value);

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
      <RichTextPlugin
        contentEditable={<ContentEditable className="outline-none" />}
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
    </LexicalComposer>
  );
}
