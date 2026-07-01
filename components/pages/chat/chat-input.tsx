"use client";

import { useState, useRef } from "react";
import { SendHorizontal, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { socket } from "@/lib/socket/client";
import { SOCKET_EVENTS } from "@/lib/socket/socket-events";
import { cn } from "@/lib/utils/general";

interface ChatInputProps {
  conversationId: string;
  userId: number;
  isSelectionMode: boolean;
  isPending: boolean;
  onSendMessage: (messageText: string) => void;
}

export default function ChatInput({
  conversationId,
  userId,
  isSelectionMode,
  isPending,
  onSendMessage,
}: ChatInputProps) {

  // Local states
  const [text, setText] = useState("");

  // Ref to track typing debounce timeout
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Handles input changes and emits typing events with debounce logic
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);

    // Emit typing start event only once per typing session
    if (!typingTimeoutRef.current) {
      socket.emit(SOCKET_EVENTS.TYPING_START, { conversationId, userId });
    }

    // Clear existing timeout to reset debounce timer
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Emit typing stop after user stops typing for 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId, userId });
      typingTimeoutRef.current = null;
    }, 2000);
  };

  /**
   * Handles sending message and cleanup of typing state
   */
  const handleSendTrigger = () => {
    if (!text.trim() || isPending) return;

    // Clear typing timeout and notify server immediately
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId, userId });
      typingTimeoutRef.current = null;
    }

    // Trigger parent send handler
    onSendMessage(text.trim());
    setText("");
  };

  return (
    <div className="border-t border-border/60 p-4 sm:p-5 bg-background select-none">
      <div
        className={cn(
          "w-full flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300 ease-out text-sm",
          isSelectionMode
            ? "bg-muted/40 border-border/40"
            : "bg-muted/20 border-border/80 focus-within:bg-background focus-within:border-input focus-within:shadow-[0_4px_20px_-4px_rgba(203,100,65,0.06)]"
        )}
      >
        {/* Selection Lock Indicator Icon */}
        {isSelectionMode && (
          <Lock size={15} className="text-muted-foreground/60 shrink-0 animate-pulse" />
        )}

        <Input
          value={text}
          onChange={handleInputChange}
          disabled={isSelectionMode}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendTrigger();
          }}
          variant="unstyled"
          placeholder={
            isSelectionMode
              ? "Exit message selection mode to chat..."
              : "Write a professional message..."
          }
          className="flex-1 h-10 px-0 bg-transparent text-foreground placeholder:text-muted-foreground/60 text-sm disabled:cursor-not-allowed font-sans font-medium outline-none"
        />

        {/* Premium Action Command Button */}
        <Button
          size="icon"
          onClick={handleSendTrigger}
          disabled={isPending || !text.trim() || isSelectionMode}
          className={cn(
            "size-9 rounded-lg bg-primary text-primary-foreground shadow-sm transition-all duration-200 shrink-0 cursor-pointer",
            "hover:bg-primary/95 hover:scale-[1.04] active:scale-[0.97]",
            "disabled:opacity-0 disabled:scale-90 disabled:pointer-events-none" // Smoothly hides when empty/disabled
          )}
        >
          <SendHorizontal size={15} className="mr-0.5" />
        </Button>
      </div>
    </div>
  );
}