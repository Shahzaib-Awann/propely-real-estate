import { Button } from "@/components/ui/button";
import List from "@/components/pages/profile/my-list";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { defaultAppSettings } from "@/lib/constants";
import Link from "next/link";
import LogoutUser from "@/components/pages/profile/logout-user";
import { getUserById } from "@/lib/actions/user.action";
import ListCard from "@/components/pages/properties/list-card";
import { getMyPropertiesList } from "@/lib/actions/properties.action";

export default async function Profile() {
  // === Authenticate user ===
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  // === Fetch user by ID (safe mode) ===
  const user = await getUserById(Number(session.user.id))

  if (!user) {
    redirect("/sign-in?error=userDeleted")
  }

  const myList = await getMyPropertiesList(Number(session.user.id))

  return (
    <main className="flex flex-col-reverse lg:flex-row h-[calc(100vh-80px)] px-4 overflow-y-auto lg:overflow-y-hidden scroll-smooth">
      {/* LEFT: User Posts and Saved List */}
      <section className="flex-3 lg:h-full">
        <div className="flex flex-col gap-10 py-5 pt-9 pr-0 pb-12 lg:pr-10 overflow-y-visible lg:overflow-y-auto h-auto lg:h-full">
          {/* My List Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">My List</h1>
            <Link href="/property/add">
              <Button className="flex items-center gap-2 px-5 h-12 min-w-12 rounded-none text-primary-foreground bg-primary/90 font-medium hover:bg-primary transition-colors font-lato">
                <Plus /> <span className="hidden md:inline">Add New property</span>
              </Button>
            </Link>
          </div>

          {/* My List Component */}
          <div className="grid grid-cols-1 gap-8">
            {myList.map((item) => (
              <ListCard key={item.id} item={item} editable={true} deleteable={true} />
            ))}
          </div>

          {/* Saved List Header */}
          <h1 className="text-2xl font-semibold">Saved List</h1>

          {/* Saved List Component */}
          <List />
        </div>
      </section>

      {/* RIGHT: User Info Panel (Desktop Only) */}
      <aside className="flex flex-2 h-full bg-side-panel pb-5 lg:pb-0 lg:py-5 rounded-lg lg:rounded-none">
        <div className="pb-10 p-4 h-full w-full">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-xl md:text-2xl">User Information</h1>
            <Link href="/profile/update">
              <Button className="px-5 h-12 min-w-12 rounded-none bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
                <Pencil /> <span className="hidden md:inline">Update Profile</span>
              </Button>
            </Link>
          </div>

          <div className="h-full flex flex-col items-center justify-center gap-5">
            <div className="size-48 rounded-lg overflow-hidden relative shadow">
              <Image
                src={user.avatar ?? defaultAppSettings.placeholderPostImage}
                alt="Avatar"
                fill
                sizes="192px"
                className="object-cover hover:scale-110 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-lg md:text-xl">
                Name: <b>{user.name}</b>
              </p>
              <p className="text-sm md:text-base">
                Email: <b>{user.email}</b>
              </p>
            </div>
            <LogoutUser />
          </div>
        </div>
      </aside>
    </main>
  );
}
