import { Button } from "@/components/ui/button";
import Chat from "@/components/pages/profile/chat/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userData } from "@/lib/dummyData";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export default function ChatPage() {
  return (
    <main className="flex flex-row h-[calc(100vh-80px)] px-4">

      {/* LEFT: Detials */}
      <section className="flex-3 h-full overflow-hidden">

        {/* Scrollable Content Wrapper */}
        <div className="h-full flex flex-col gap-4 pr-4 lg:pr-10 py-5 pb-5 overflow-y-auto">

          {/*  CHAT HEADER  */}
          <div className="flex items-center justify-between pb-3 border-b">
            <div className="flex items-center gap-4">

              <Avatar className="w-12 h-12">
                <AvatarImage src={userData.img} alt={userData.name} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="flex flex-col leading-tight">
                <h1 className="text-lg font-bold">
                  Alice Johnson <span className="text-xs font-normal text-gray-600">(Buyer)</span>
                </h1>
                <p className="text-sm text-gray-600">
                  Beautiful 2BHK Apartment <span className="text-xs">(Property)</span>
                </p>
              </div>
            </div>

            <Button className="px-5 py-3 rounded text-white bg-[#cb6441] font-medium hover:bg-[#b55b3c] transition-colors font-lato">
              Delete Chat
            </Button>
          </div>

          {/*  MESSAGES AREA  */}
          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">


            <div className="flex justify-start">
              <div className="max-w-[75%] bg-gray-200 text-gray-900 px-4 py-2 rounded-xl shadow-sm">
                Sure! What would you like to know?
              </div>
            </div>

            {/* Example User Message */}
            <div className="flex justify-end">
              <div className="max-w-[75%] bg-[#cb6441] text-white px-4 py-2 rounded-xl shadow-sm">
                Hi, I want to know more about the apartment.
              </div>
            </div>

            {/* Example Receiver Message */}
            <div className="flex justify-start">
              <div className="max-w-[75%] bg-gray-200 text-gray-900 px-4 py-2 rounded-xl shadow-sm">
                Sure! What would you like to know?
              </div>
            </div>

          </div>

          {/* CHAT INPUT */}
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

        </div>

      </section>

      {/* RIGHT: Map Display (Desktop Only) */}
      <aside className="hidden lg:block flex-2 h-full bg-[#eac9a8]/50 py-5">

        {/* Interactive Map */}
        <div className="p-4 h-full">
          <Chat />
        </div>

      </aside>
    </main>
  );
}