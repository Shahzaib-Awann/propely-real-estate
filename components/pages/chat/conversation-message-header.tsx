"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { usePresenceStore } from '@/lib/store/use-presence-store'
import { ConversationHeader } from '@/types/propely.chat'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const ConversationMessageHeader = ({ conversation } : {conversation : ConversationHeader | null }) => {

    const isOnline = usePresenceStore((state) =>
    state.isUserOnline(String(conversation?.otherUser.id))
  );

  return (
    <header className="border-b p-4 flex items-center gap-4">
        <Link href="/chat" className="lg:hidden">
          <ArrowLeft size={20} />
        </Link>

        <div className="relative shrink-0">
        <Avatar className="h-12 w-12 shadow-sm">
          <AvatarImage
            src={
              conversation?.otherUser.avatar ??
              undefined
            }
            alt={conversation?.otherUser.name}
            className="group-hover:scale-110 transition-all duration-300"
          />
          <AvatarFallback>
            {conversation?.otherUser.name
              ?.slice(0, 2)
              .toUpperCase() ?? "GU"}
          </AvatarFallback>
        </Avatar>

        {isOnline && (
          <span className="absolute bottom-0 size-4 transition-all duration-500 right-0 rounded-full border-2 border-background bg-green-500" />
        )}
      </div>

        <div>
          <h2 className="font-semibold">
            {conversation?.otherUser.name}
          </h2>

          <p className="text-sm text-muted-foreground">
            {conversation?.property.title}
          </p>
        </div>
      </header>
  )
}

export default ConversationMessageHeader