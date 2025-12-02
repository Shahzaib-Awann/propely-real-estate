import { userData } from "@/lib/dummyData";
import { Button } from "@/components/ui/button";
import List from "@/components/pages/profile/my-list";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";

export default function Profile() {
  return (
    <main className="flex flex-col-reverse lg:flex-row h-[calc(100vh-80px)] px-4 overflow-y-auto lg:overflow-y-hidden scroll-smooth">

      {/* LEFT: User Posts and Saved List */}
      <section className="flex-3 lg:h-full">
        <div className="flex flex-col gap-10 py-5 pr-0 pb-12 lg:pr-10 overflow-y-visible lg:overflow-y-auto h-auto lg:h-full">

          {/* My List Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">My List</h1>
            <Button className="flex items-center gap-2 px-5 py-3 rounded text-white bg-[#cb6441] font-medium hover:bg-[#b55b3c] transition-colors font-lato">
              <Plus /> <span className="hidden md:inline">Create New Post</span>
            </Button>
          </div>

          {/* My List Component */}
          <List />

          {/* Saved List Header */}
          <h1 className="text-2xl font-semibold">Saved List</h1>

          {/* Saved List Component */}
          <List />

        </div>
      </section>

      {/* RIGHT: User Info Panel (Desktop Only) */}
      <aside className="flex flex-2 h-full bg-[#eac9a8]/50 pb-5 lg:pb-0 lg:py-5 rounded-lg lg:rounded-none">

        <div className="p-4 h-full w-full">
          <div className="flex flex-row justify-between">
            <h1 className="text-xl md:text-2xl">
              User Information
            </h1>
            <Button className="px-5 py-3 rounded text-white bg-[#cb6441] font-medium hover:bg-[#b55b3c] transition-colors font-lato">
              <Pencil />
              <span className="hidden md:block">
                Update Profile
              </span>
            </Button>
          </div>
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <div className="size-48 rounded-lg overflow-hidden relative hover:scale-105 shadow transition-all duration-200">
              <Image src={userData.img} alt="Avatar" fill className="object-cover hover:scale-110 transition-all duration-200" />
            </div>
            <p className="text-lg md:text-xl">
              Name: <b>{userData.name}</b>
            </p>
            <p className="text-base md:text-lg">
              Email: <b>{userData.name}</b>
            </p>
          </div>
        </div>

    </aside>
    </main >
  );
}
