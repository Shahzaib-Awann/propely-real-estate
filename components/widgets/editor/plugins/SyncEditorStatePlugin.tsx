import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";



/**
 * === Synchronize Lexical editor state from an external value. ===
 *
 * Parses and sets the initial editor state from the provided `value`
 * when the editor first mounts. Prevents rehydration on subsequent renders.
 *
 * @param value - Optional string representing a serialized Lexical editor state.
 * @returns {null} This plugin does not render any UI.
 */
export function SyncEditorStatePlugin({ value }: { value?: string }) {
  const [editor] = useLexicalComposerContext();
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!value || hydratedRef.current) return;

    const parsed = editor.parseEditorState(value);
    editor.setEditorState(parsed);

    hydratedRef.current = true;
  }, [value, editor]);

  return null;
}