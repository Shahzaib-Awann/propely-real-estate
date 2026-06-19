// @/components/pages/chat/empty-state.tsx

export default function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">
          Messages
        </h2>

        <p className="text-muted-foreground mt-2">
          Select a conversation to start chatting.
        </p>
      </div>
    </div>
  );
}