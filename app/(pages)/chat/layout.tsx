import SocketProvider from "@/lib/socket-provider";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SocketProvider />
      {children}
    </>
  );
}