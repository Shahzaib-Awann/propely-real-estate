"use client";

// @/components/pages/chat/chat-header.tsx

import Link from "next/link";
import { ArrowLeft, Ellipsis } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConversationHeader } from "@/types/propely.chat";
import { usePresenceStore } from "@/lib/store/use-presence-store";

interface ChatHeaderProps {
  conversation: ConversationHeader | null;
  onSelectMessagesMode: () => void;
}

export default function ChatHeader({ conversation, onSelectMessagesMode }: ChatHeaderProps) {
  const isOnline = usePresenceStore((state) => state.isUserOnline(String(conversation?.otherUser.id)));

  return (
    <header className="border-b border-border p-4 flex items-center justify-between gap-4 bg-background z-10">
      <div className="flex items-center gap-3">
        <Link href="/chat" className="lg:hidden text-foreground hover:text-primary transition-colors duration-200">
          <ArrowLeft size={20} />
        </Link>
        <div className="relative shrink-0 group">
          <Avatar className="h-11 w-11 shadow-sm border border-border overflow-hidden">
            <AvatarImage src={conversation?.otherUser.avatar ?? undefined} alt={conversation?.otherUser.name} className="object-cover group-hover:scale-110 transition-all duration-300" />
            <AvatarFallback className="bg-muted font-lato text-sm font-semibold text-foreground/70">
              {conversation?.otherUser.name?.slice(0, 2).toUpperCase() ?? "GU"}
            </AvatarFallback>
          </Avatar>
          {isOnline && <span className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-background bg-green-500 shadow-sm animate-pulse" />}
        </div>
        <div>
          <h2 className="font-lato font-bold text-base text-foreground tracking-tight leading-tight">{conversation?.otherUser.name}</h2>
          <p className="text-xs font-lato text-foreground/60 mt-0.5 max-w-[200px] sm:max-w-xs truncate">
            Regarding: <span className="font-medium text-foreground/80">{conversation?.property.title}</span>
          </p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="rounded-radius bg-transparent text-foreground hover:bg-card-foreground hover:text-primary-foreground/75 transition-all duration-200 cursor-pointer">
            <Ellipsis className="rotate-90 size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-background border border-border text-foreground p-1 shadow-md">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 py-1.5 text-xs font-lato font-medium text-foreground/50 tracking-wide uppercase">Conversation Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild className="w-full px-2 py-2 text-sm font-lato rounded-xs cursor-pointer focus:bg-primary focus:text-primary-foreground">
              <button onClick={onSelectMessagesMode} className="w-full text-left flex items-center justify-between">
                <span>Select Messages</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}