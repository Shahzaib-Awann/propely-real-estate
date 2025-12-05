import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React from 'react'

const chat = [
    {
        id: 1,
        avatar: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
        name: 'Jhon Doe',
        property: 'Beautiful 2BHK Apartment',
        lastMessage: 'Lorem ipsum dolor sit amet.',
        seen: false,
    },
    {
        id: 2,
        avatar: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
        name: 'Jhon Doe',
        property: 'Beautiful 2BHK Apartment',
        lastMessage: 'Lorem ipsum dolor sit amet.',
        seen: true,
    },
    {
        id: 3,
        avatar: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
        name: 'Jhon Doe',
        property: 'Beautiful 2BHK Apartment',
        lastMessage: 'Lorem ipsum dolor sit amet.',
        seen: true,
    },
    {
        id: 4,
        avatar: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
        name: 'Jhon Doe',
        property: 'Beautiful 2BHK Apartment',
        lastMessage: 'Lorem ipsum dolor sit amet.',
        seen: false,
    },
    {
        id: 5,
        avatar: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
        name: 'Jhon Doe',
        property: 'Beautiful 2BHK Apartment',
        lastMessage: 'Lorem ipsum dolor sit amet.',
        seen: true,
    },
    {
        id: 6,
        avatar: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
        name: 'Jhon Doe',
        property: 'Beautiful 2BHK Apartment',
        lastMessage: 'Lorem ipsum dolor sit amet.',
        seen: true,
    },
    {
        id: 7,
        avatar: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
        name: 'Jhon Doe',
        property: 'Beautiful 2BHK Apartment',
        lastMessage: 'Lorem ipsum dolor sit amet.',
        seen: true,
    },
    {
        id: 8,
        avatar: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
        name: 'Jhon Doe',
        property: 'Beautiful 2BHK Apartment',
        lastMessage: 'Lorem ipsum dolor sit amet.',
        seen: true,
    },
]

const Chat = () => {
    return (
      <div className="h-full flex flex-col gap-5">
        {/* Header */}
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
  
        {/* Messages List */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 py-2">
  
          {chat.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/75 backdrop-blur shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer hover:bg-white"
            >
              {/* Avatar */}
              <div className="relative ">
                <Avatar className="size-11 shadow-sm">
                  <AvatarImage src={c.avatar} alt={c.name} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                {/* <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span> */}
              </div>
  
              {/* Message Info */}
              <div className="flex flex-col overflow-hidden">
                <span className="font-semibold text-gray-900 text-lg">
                  {c.name}
                </span>
                <span className="text-sm text-gray-500 truncate">
                  {c.property}
                </span>
                <span className="text-sm text-gray-700 truncate">
                  {c.lastMessage}
                </span>
              </div>
  
              {/* Seen Indicator */}
              <div className="ml-auto text-xs text-green-600 font-medium">
              <span
    className={`w-3 h-3 rounded-full inline-block ${
      c.seen ? "bg-transparent" : "bg-green-500"
    }`}
  ></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default Chat