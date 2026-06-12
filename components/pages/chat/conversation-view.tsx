import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

interface Props {
  conversationId: string;
}

export default function ConversationView({
  conversationId,
}: Props) {
  console.log({conversationId})
  return (
    <div className="flex flex-col flex-1">

      {/* Header */}
      <header className="border-b p-4 flex items-center gap-4">
        <Link
          href="/chats"
          className="lg:hidden"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h2 className="font-semibold">
            Ahmed Khan
          </h2>

          <p className="text-sm text-muted-foreground">
            House DHA Karachi
          </p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        <div className="flex justify-start">
          <div className="rounded-xl bg-muted px-4 py-2">
            Hello
          </div>
        </div>

        <div className="flex justify-end">
          <div className="rounded-xl bg-primary text-primary-foreground px-4 py-2">
            Is this available?
          </div>
        </div>

      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            placeholder="Type a message..."
            className="flex-1 rounded-md border px-3 py-2"
          />

          <button className="rounded-md border px-4">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}