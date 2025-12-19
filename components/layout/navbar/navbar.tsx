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
import { Menu, MessageCircleMore, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { auth } from "@/auth";
import { getAvatarFallback } from "@/lib/utils/general";
import { getUserById } from "@/lib/actions/user.action";



const links = [
  { title: "Home", url: "/" },
  { title: "About", url: "/about" },
  { title: "Contact", url: "/contact" },
  { title: "Agents", url: "/agents" },
];



export default async function Navbar() {
  
  let user = null;

  // === Authenticate user ===
  const session = await auth()

  if (session?.user?.id) {
    user = await getUserById(Number(session.user.id))
  }

  return (
    <nav className="flex items-center justify-between h-20 w-full bg-transparent z-50 relative p-0 px-4">
      {/* Left: Logo + Desktop Links */}
      <div className="flex flex-3 items-center gap-10">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl font-geist w-24 h-14 relative"
        >
          <Image
            src="/images/main-logo-light.png"
            alt="Logo"
            fill
            sizes="100px"
            className="object-cover hover:scale-105 transition-all duration-200"
          />
        </Link>

        <div className="hidden md:flex gap-10">
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.url}
              className="text-base font-lato font-medium text-foreground hover:text-primary hover:scale-110 transition-all duration-200"
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Right Section: Avatar/Profile + Mobile Menu */}
      <div className="flex flex-2 lg:bg-side-panel h-full w-full">
        <div className="w-full h-full gap-4 p-4 flex items-center justify-end">
          {/* Avatar/Profile */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className="flex flex-row gap-2 items-center"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
                  <AvatarFallback>
                    {getAvatarFallback(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="lg:block hidden text-foreground">
                  {user.name}
                </span>
              </Link>

              {/* Desktop: show name + profile button */}
              <div className="flex items-center gap-4 font-semibold">
                <Link href="/chats">
                  <Button className="px-5 h-12 rounded-none bg-primary text-primary-foreground font-medium hover:bg-primary/80 transition-colors font-lato relative">
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs shadow-sm">
                      3
                    </span>
                    <MessageCircleMore className="md:hidden block" />
                    <span className="hidden md:block">Chats</span>
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link
                href="/sign-in"
                className="px-5 h-12 rounded-radius font-medium text-foreground hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors font-lato"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="px-5 h-12 rounded-radius bg-primary text-primary-foreground hover:bg-primary/80 flex items-center justify-center font-medium transition-colors font-lato"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
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
          className="rounded-radius bg-transparent text-foreground focus:outline-none focus:ring-0 hover:bg-card-foreground hover:text-primary-foreground/75 transition-all duration-300"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        closeButton={true}
        className="w-64 bg-card-foreground text-foreground border-none flex justify-center items-center"
      >
        <SheetHeader>
          <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Navigation panel
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-10 mt-4">
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.url}
              className="text-lg text-primary-foreground hover:text-primary hover:underline transition-colors"
            >
              {link.title}
            </Link>
          ))}

          {/* Mobile Auth Buttons */}
          {!user && (
            <>
              <Link
                href="/sign-in"
                className="text-lg text-primary-foreground hover:text-primary hover:underline transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="text-lg text-primary-foreground hover:text-primary hover:underline transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <SheetClose asChild>
          <button className="absolute text-primary-foreground/75 hover:text-primary top-4 right-4 p-2">
            <X />
          </button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
};
