import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Interface for chat items
interface ChatsInterface {
  id: number;
  avatar: string;
  name: string;
  property: string;
  lastMessage: string;
  not_seen: boolean;
}

// Chats list component
const ChatsCardList: React.FC<{ chats: ChatsInterface[]; onSelectChat: (id: string) => void }> = ({ chats, onSelectChat }) => {
  return (
    <div className="h-full flex flex-col gap-5">
      
      {/* Header */}
      <h1 className="text-2xl font-bold tracking-tight">Messages</h1>

      {/* Chats List */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 py-2">
        {chats.map(chat => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(String(chat.id))}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/75 backdrop-blur shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer hover:bg-white"
          >
            {/* Avatar */}
            <div className="relative">
              <Avatar className="size-11 shadow-sm">
                <AvatarImage src={chat.avatar} alt={chat.name} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              {/* Optional online indicator */}
              {/* <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span> */}
            </div>

            {/* MMessage Info */}
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-gray-900 text-lg line-clamp-1">{chat.name}</span>
              <span className="text-sm text-gray-500 line-clamp-1">{chat.property}</span>
              <span className="text-sm text-gray-700 line-clamp-1">{chat.lastMessage}</span>
            </div>

            {/* Message Indicator */}
            <div className="ml-auto text-xs text-green-600 font-medium">
              <span
                className={`w-3 h-3 rounded-full inline-block ${chat.not_seen ? "bg-transparent" : "bg-green-500"}`}
              ></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatsCardList;
