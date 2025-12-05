import Navbar from "@/components/Navbar/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties - Propely",
  description: "Browse available real estate listings on Propely.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-foreground max-w-340 min-h-screen mx-auto flex flex-col">
      
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
    </div>
  );
}
