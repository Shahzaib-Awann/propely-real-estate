import { Button } from "@/components/ui/button";
import List from "@/components/pages/profile/my-list";
import Image from "next/image";
import { Building2, Pencil, Plus } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutUser from "@/components/pages/profile/logout-user";
import { getUserById } from "@/lib/actions/user.action";
import { getPropertiesByUserId } from "@/lib/actions/properties.action";
import ListClient from "@/components/pages/properties/list-client";
import { safeImage } from "@/lib/utils/general";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "My Profile",
  description:
    "Manage your Propely account, property listings, saved properties, and profile settings.",
  path: "/profile",
  noIndex: true,
});

export default async function Profile() {
  // === Authenticate user ===
  const session = await auth();
  const userId = Number(session?.user?.id);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // === Fetch user by ID (safe mode) ===
  const user = await getUserById(userId);

  if (!user) {
    redirect("/sign-in?error=userDeleted");
  }

  const myList = await getPropertiesByUserId(userId);

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
                <Plus />{" "}
                <span className="hidden md:inline">Add New property</span>
              </Button>
            </Link>
          </div>

          {/* My List Component */}
          <div className="grid grid-cols-1 gap-8">
            {myList.length > 0 ? (
              <ListClient list={myList} />
            ) : (
              <div className="rounded-2xl border bg-card p-12">
                <div className="mx-auto flex max-w-md flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />
                    <Building2 className="relative size-14 text-primary" />
                  </div>

                  <h3 className="text-xl font-semibold">
                    Your portfolio starts here
                  </h3>

                  <p className="mt-3 text-muted-foreground">
                    You haven&apos;t published any properties yet. Create your
                    first listing and start reaching thousands of buyers and
                    renters.
                  </p>

                  <Link href="/property/add" className="mt-8">
                    <Button size="lg" className="gap-2">
                      <Plus className="size-4" />
                      Publish Property
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Saved List Header */}
          <h2 className="text-2xl font-semibold">Saved List</h2>

          {/* Saved List Component */}
          <List />
        </div>
      </section>

      {/* RIGHT: User Info Panel (Desktop Only) */}
      <aside className="flex flex-2 h-full bg-side-panel pb-5 lg:pb-0 lg:py-5 rounded-lg lg:rounded-none">
        <div className="pb-10 p-4 h-full w-full">
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-xl md:text-2xl">User Information</h2>
            <Link href="/profile/update">
              <Button className="px-5 h-12 min-w-12 rounded-none bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
                <Pencil />{" "}
                <span className="hidden md:inline">Update Profile</span>
              </Button>
            </Link>
          </div>

          <div className="h-full flex flex-col items-center justify-center gap-5">
            <div className="size-48 rounded-lg overflow-hidden relative shadow">
              <Image
                src={safeImage(user.avatar)}
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
            <LogoutUser userId={userId} />
          </div>
        </div>
      </aside>
    </main>
  );
}
