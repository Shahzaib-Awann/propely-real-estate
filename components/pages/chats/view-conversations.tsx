import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send, Trash } from 'lucide-react';

interface ViewConversationProps {
    selectedChatId: string | null;
    onSelectChat: (id: string | null) => void;
}

const ViewConversation: React.FC<ViewConversationProps> = ({ selectedChatId, onSelectChat }) => {

    // Dummy conversation metadata
    const conversation = {
        avatar: '',
        name: "Jhon Doe",
        propertyName: 'Beautiful 2BHK Apartment',
        buyer: 'Alice Johnson'
    };

    // Dummy messages
    const dummyConversation = [
        { id: 1, sender: "receiver", message: "Hi! Is the apartment still available?", time: "10:00 AM" },
        { id: 2, sender: "sender", message: "Yes, it is. Would you like to schedule a visit?", time: "10:05 AM" },
        { id: 3, sender: "receiver", message: "That would be great. When is the earliest available slot?", time: "10:07 AM" },
        { id: 4, sender: "sender", message: "We have a slot tomorrow at 2 PM. Does that work for you?", time: "10:10 AM" },
    ];

    // If no chat is selected, show placeholder
    if (!selectedChatId) {
        return (
            <div className="w-full h-full items-center justify-center hidden lg:flex">
                Click to view the conversation
            </div>
        );
    }

    return (
        <>
            {/* CHAT HEADER */}
            <div className="flex items-center justify-between pb-3 border-b">
                {/* Left: Back button + Avatar + Buyer info */}
                <div className="flex items-center gap-4">
                    <Button onClick={() => onSelectChat(null)} className='lg:hidden' variant="ghost" size="icon">
                        <ArrowLeft />
                    </Button>

                    <Avatar className="w-12 h-12">
                        <AvatarImage loading='eager' src={conversation.avatar} alt={conversation.name} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col leading-tight">
                        <h1 className="text-lg font-bold">
                            {conversation.buyer} <span className="text-xs font-normal text-gray-600">(Buyer)</span>
                        </h1>
                        <p className="text-sm text-gray-600">
                            {conversation.propertyName} <span className="text-xs">(Property)</span>
                        </p>
                    </div>
                </div>

                {/* Right: Delete conversation button */}
                <Button size="icon" variant="destructive">
                    <Trash />
                </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
                {dummyConversation.map(msg => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "sender" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[75%] px-4 py-2 rounded-xl shadow-sm ${msg.sender === "sender" ? "bg-primary text-white" : "bg-gray-200 text-gray-900"}`}
                        >
                            <div>{msg.message}</div>
                            <p className="text-xs text-right">{msg.time}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat Input */}
            <div className="flex items-end gap-2 p-3 bg-white rounded-xl shadow-md sticky bottom-0">
                <Textarea
                    className="w-full min-h-[40px] max-h-32 resize-none rounded-lg border border-gray-300 
                     px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cb6441]/40 
                     focus:border-[#cb6441] transition-all"
                    placeholder="Type a message..."
                />
                <Button className="p-2 rounded-lg bg-[#cb6441] hover:bg-[#b55b3c] text-white flex items-center justify-center h-11 w-11">
                    <Send className="w-5 h-5" />
                </Button>
            </div>
        </>
    );
};

export default ViewConversation;
