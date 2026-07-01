"use client";

// @/components/pages/chat/chat-header.tsx

import Link from "next/link";
import { ArrowLeft, Ellipsis, CheckSquare } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConversationHeader } from "@/types/propely.chat";
import { usePresenceStore } from "@/lib/store/use-presence-store";
import { getAvatarFallback } from "@/lib/utils/general";

interface ChatHeaderProps {
  conversation: ConversationHeader | null;
  onSelectMessagesMode: () => void;
}

export default function ChatHeader({ conversation, onSelectMessagesMode }: ChatHeaderProps) {

  // Check real-time online status of the other user in the conversation
  const isOnline = usePresenceStore((state) => state.isUserOnline(String(conversation?.otherUser.id)));

  // If conversation data is not available, render nothing
  if (!conversation) return null;

  return (
    <header className="h-20 border-b border-border px-6 flex items-center justify-between gap-4 bg-background/90 backdrop-blur-md sticky top-0 z-40 select-none">
      {/* Left Section: Back Interaction + User Profile Card */}
      <div className="flex items-center gap-4 min-w-0">
        <Link
          href="/chat"
          className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-radius transition-all duration-200"
        >
          <ArrowLeft size={20} />
        </Link>

        {/* Profile Avatar Block with Smooth Rings */}
        <div className="relative shrink-0 group">
          <Avatar className="h-11 w-11 shadow-sm border border-border/60 transition-transform duration-300 group-hover:scale-102">
            <AvatarImage
              src={conversation.otherUser.avatar ?? undefined}
              alt={conversation.otherUser.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-muted font-lato text-sm font-bold text-muted-foreground">
              {getAvatarFallback(conversation.otherUser.name)}
            </AvatarFallback>
          </Avatar>

          {/* Status Badge Ring Anchor */}
          {isOnline && (
            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-emerald-500 shadow-2xs transition-transform duration-300 group-hover:scale-110" />
          )}
        </div>

        {/* User Identity & Associated Asset String Context */}
        <div className="min-w-0 flex flex-col justify-center">
          <h2 className="font-lato font-bold text-base text-foreground tracking-tight leading-none mb-1">
            {conversation.otherUser.name}
          </h2>

          {/* Upper-case Micro Badge formatting linking to your site layout syntax */}
          <div className="flex items-center gap-1 text-[11px] font-sans text-muted-foreground truncate">
            <span className="uppercase font-medium tracking-wider text-primary/80 text-[10px]">Regarding</span>
            <span className="text-muted-foreground/40">•</span>
            <span className="font-medium text-foreground/80 truncate font-lato">
              {conversation.property.title}
            </span>
          </div>
        </div>
      </div>

      {/* Right Section: Dropdown Options Trigger Action Bundle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className="rounded-radius bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border/40 size-10 transition-all duration-200 shadow-none cursor-pointer"
          >
            <Ellipsis className="size-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={6}
          className="w-52 bg-popover border border-border text-popover-foreground p-1.5 rounded-radius shadow-xl animate-in fade-in-50 slide-in-from-top-1 duration-150"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2.5 py-2 text-[10px] font-sans font-bold text-muted-foreground/80 tracking-widest uppercase">
              Conversation Actions
            </DropdownMenuLabel>

            <DropdownMenuItem
              asChild
              className="w-full px-2.5 py-2 text-sm font-lato rounded-sm cursor-pointer transition-all duration-150 focus:bg-primary focus:text-primary-foreground text-foreground/90 group"
            >
              <button
                onClick={onSelectMessagesMode}
                className="w-full text-left flex items-center justify-between gap-2"
              >
                <span className="font-medium">Select Messages</span>
                <CheckSquare size={16} className="text-muted-foreground group-focus:text-primary-foreground/80 transition-colors" />
              </button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}