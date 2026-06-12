import Link from "next/link";

const conversations = [
  {
    id: "conv-1",
    seller: "Ahmed Khan",
    property: "House DHA Karachi",
    lastMessage: "Still available?",
  },
  {
    id: "conv-2",
    seller: "Bilal Ahmed",
    property: "Apartment Clifton",
    lastMessage: "Can I visit tomorrow?",
  },
];

export default function ConversationList() {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4">
        <h1 className="text-2xl font-bold">
          Messages
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <Link
            key={conversation.id}
            href={`/chat/${conversation.id}`}
            className="block border-b p-4 hover:bg-muted"
          >
            <h3 className="font-semibold">
              {conversation.seller}
            </h3>

            <p className="text-sm text-muted-foreground">
              {conversation.property}
            </p>

            <p className="text-sm truncate">
              {conversation.lastMessage}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}