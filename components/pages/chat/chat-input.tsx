"use client";

// @/components/pages/chat/chat-input.tsx

import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { socket } from "@/lib/socket/client";
import { SOCKET_EVENTS } from "@/lib/socket/socket-events";

interface ChatInputProps {
  conversationId: string;
  userId: number;
  isSelectionMode: boolean;
  isPending: boolean;
  onSendMessage: (messageText: string) => void;
}

export default function ChatInput({ conversationId, userId, isSelectionMode, isPending, onSendMessage }: ChatInputProps) {
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);

    if (!typingTimeoutRef.current) {
      socket.emit(SOCKET_EVENTS.TYPING_START, { conversationId, userId });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId, userId });
      typingTimeoutRef.current = null;
    }, 2000);
  };

  const handleSendTrigger = () => {
    if (!text.trim() || isPending) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId, userId });
      typingTimeoutRef.current = null;
    }

    onSendMessage(text.trim());
    setText("");
  };

  return (
    <div className="border-t border-border p-4 bg-background">
      <div className="border border-border rounded-md px-2 py-1.5 flex items-center gap-2 bg-background focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition-all text-sm">
        <Input
          value={text}
          onChange={handleInputChange}
          disabled={isSelectionMode}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendTrigger();
          }}
          variant="unstyled"
          placeholder={isSelectionMode ? "Exit message selection mode to chat..." : "Write a professional message..."}
          className="flex-1 h-10 px-2 bg-transparent text-foreground placeholder:text-foreground/40 text-sm disabled:cursor-not-allowed"
        />
        <Button
          size="icon"
          onClick={handleSendTrigger}
          disabled={isPending || !text.trim() || isSelectionMode}
          className="size-10 rounded-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 shrink-0 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}