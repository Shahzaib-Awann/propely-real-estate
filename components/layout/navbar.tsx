import Image from "next/image";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { auth } from "@/auth";
import { getAvatarFallback } from "@/lib/utils/general";
import { getUserById } from "@/lib/actions/user.action";
import ChatBadge from "@/components/pages/chat/chat-badge";
import { getTotalUnreadMessages } from "@/lib/actions/chat.action";

const links = [
  { title: "Home", url: "/" },
  { title: "Properties", url: "/properties" },
  { title: "About", url: "/about" },
  { title: "Contact", url: "https://shahzaib.is-a.dev/contact", newTab: true },
];

export default async function Navbar() {
  let user = null;
  let initialUnreadCount = 0;
  // === Authenticate user ===
  const session = await auth();

  if (session?.user?.id) {
    user = await getUserById(Number(session.user.id));

    initialUnreadCount = await getTotalUnreadMessages({
      userId: Number(session.user.id),
      scope: "all",
    });
  }

  return (
    <nav className="flex items-center justify-between h-20 w-full bg-transparent z-50 relative p-0 px-4">
      {/* Left Box (flex-3): Logo + Desktop Navigation Links */}
      <div className="flex flex-3 items-center gap-10">
        <Link
          href="/"
          className="flex items-center font-bold text-xl font-geist w-28 h-14 relative group overflow-hidden"
        >
          <Image
            src="/images/main-logo-transparent.png"
            alt="Logo"
            fill
            sizes="200px"
            className="object-cover group-hover:scale-105 transition-all duration-200"
          />
        </Link>

        <div className="hidden md:flex gap-10 items-end h-14 pb-1 ">
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.url}
              target={link.newTab ? "_blank" : "_self"}
              rel={link.newTab ? "noopener noreferrer" : undefined}
              className="text-base font-lato font-medium text-foreground hover:text-primary transition-all duration-200 inline-block"
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Right Box (flex-2): Profile/Auth + Mobile Menu Trigger */}
      <div className="flex flex-2 lg:bg-side-panel h-full dynamic-right-panel justify-end items-center">
        <div className="w-full h-full gap-4 px-4 flex items-center justify-end">
          {/* Avatar / Profile State */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className="flex flex-row gap-2 items-center group"
              >
                <Avatar className="size-10 transition-transform duration-200 group-hover:scale-105">
                  <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
                  <AvatarFallback>
                    {getAvatarFallback(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="lg:block hidden text-foreground group-hover:text-primary transition-colors duration-200 font-lato">
                  {user.name}
                </span>
              </Link>

              {/* Chat / Notifications Link Button */}
              <div className="flex items-center gap-4 font-semibold">
                <Link href="/chat">
                  <Button className="w-10 h-10 md:px-5 md:h-12 md:w-auto  relative rounded-radius! bg-primary text-primary-foreground hover:bg-primary/80 flex items-center justify-center font-medium transition-all duration-200 hover:scale-[1.02] font-lato">
                    <ChatBadge initialCount={initialUnreadCount} />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            /* Desktop Auth Action Trigger Block */
            <div className="hidden md:flex gap-2">
              <Link
                href="/sign-in"
                className="px-5 h-12 rounded-radius font-medium text-foreground hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-200 hover:scale-105 font-lato"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="px-5 h-12 rounded-radius bg-primary text-primary-foreground hover:bg-primary/80 flex items-center justify-center font-medium transition-all duration-200 hover:scale-[1.02] font-lato"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Responsive Mobile Layout Navigation Trigger */}
          <div className="md:hidden flex items-center">
            <MobileSheet user={!!user} />
          </div>
        </div>
      </div>
    </nav>
  );
}

// === MOBILE SHEET MENU ===
const MobileSheet = ({ user }: { user: boolean }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-radius bg-transparent text-foreground focus:outline-none focus:ring-0 hover:bg-card-foreground hover:text-primary-foreground/75 transition-all duration-200 hover:scale-105"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        closeButton={
          false
        } /* Turned off default to cleanly utilize our layout's exact absolute close button pattern below */
        className="w-64 bg-card-foreground text-foreground border-none flex justify-center items-center"
      >
        <SheetHeader>
          <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Navigation panel
          </SheetDescription>
        </SheetHeader>

        {/* Links stack utilizing smooth micro-interaction guidelines[cite: 1] */}
        <div className="flex flex-col gap-10 mt-4 items-center w-full">
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.url}
              className="text-lg text-primary-foreground font-lato hover:text-primary transition-all duration-200 hover:scale-110"
            >
              {link.title}
            </Link>
          ))}

          {/* Mobile Auth Buttons Stack */}
          {!user && (
            <>
              <div className="w-1/2 h-1 border-t border-primary-foreground/20" />
              <Link
                href="/sign-in"
                className="text-lg text-primary-foreground font-lato hover:text-primary transition-all duration-200 hover:scale-110"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="text-lg font-semibold text-primary font-lato hover:scale-110 transition-transform duration-200"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Refined Explicit Action Close Overlay Button */}
        <SheetClose asChild>
          <button className="absolute text-primary-foreground/75 hover:text-primary top-4 right-4 p-2 transition-transform duration-200 hover:scale-110 focus:outline-none cursor-pointer">
            <X className="size-6" />
          </button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
};
