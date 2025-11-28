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



const links = [
  { title: "Home", url: "/" },
  { title: "About", url: "/about" },
  { title: "Contact", url: "/contact" },
  { title: "Agents", url: "/agents" },
];



export default function Navbar() {
  return (
    <nav className="flex items-center justify-between h-20 px-4 md:px-8 w-full bg-trasparent z-50 relative">
      
      {/* Left: Logo + desktop links */}
      <div className="flex flex-3 items-center gap-10">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl font-geist w-24 h-14 relative">
          <Image src="/images/main-logo-light.png" alt="Logo" fill sizes="100px" className="object-cover hover:scale-105  transition-all duration-200" />
        </Link>

        {/* Links */}
        <div className="hidden md:flex gap-10">
          {links.map((link) => (
            <Link key={link.title} href={link.url} className="text-base font-lato font-medium hover:text-[#cb6441] hover:scale-110  transition-all duration-200">
              {link.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <MobileSheet />

      {/* Desktop sign‑in / sign‑up (hidden on mobile) */}
      <div className="hidden md:flex flex-2 justify-end items-center gap-4" >
      
      {/* background highlight */}
      <div className="absolute w-md right-0 h-full bg-[#eac9a8]/50 lg:block hidden -z-10"></div>

        <Link href="#" className="px-5 py-2 rounded text-black font-medium hover:text-white hover:bg-[#cb6441] transition-colors font-lato" >
          Sign in
        </Link>
        <Link href="#" className="px-5 py-2 rounded text-white bg-[#cb6441] font-medium hover:bg-[#b55b3c] transition-colors font-lato">
          Sign up
        </Link>

      </div>
    </nav>
  );
}



// === MOBILE SHEET MENU ===
const MobileSheet = () => {
  return (
    <div className="flex items-center gap-4 md:hidden">
        <Sheet>
          {/* Menu Button */}
          <SheetTrigger asChild>
            <button className="p-2 rounded focus:outline-none focus:ring-0 hover:bg-[#262626] hover:text-white transition-all duration-300 focus:ring-gray-400">
              <Menu />
            </button>
          </SheetTrigger>

          {/* Slide-out Menu */}
          <SheetContent side="right" closeButton={true} className="w-64 bg-[#1a1813] border-none flex justify-center items-center">  {/* adjust width as needed */}
            <SheetHeader>
              <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">This panel contains the main navigation links.</SheetDescription>
            </SheetHeader>

            {/* Mobile Links */}
            <div className="flex flex-col gap-10 mt-4">
              {links.map((link) => (
                <Link key={link.title} href={link.url} className="text-lg text-white font-lato hover:text-[#cb6441] hover:underline transition-colors" >
                  {link.title}
                </Link>
              ))}

              {/* Auth Buttons in Menu */}
              <Link href="#" className="text-lg text-white font-lato hover:text-[#cb6441] hover:underline transition-colors">
                Sign in
              </Link>
              <Link href="#" className="text-lg text-white font-lato hover:text-[#cb6441] hover:underline transition-colors">
                Sign up
              </Link>

            </div>

            {/* Close Button */}
            <SheetClose asChild>
              <button className="absolute text-white hover:text-[#cb6441] top-4 right-4 p-2">
                <X />
              </button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </div>
  )
}